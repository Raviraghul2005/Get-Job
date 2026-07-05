import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { GoogleGenAI } from "@google/genai";
import { PDFParse } from "pdf-parse";
import { pathToFileURL } from "url";
import path from "path";
import { checkRateLimit } from "@/lib/rate-limit";

// Configure absolute worker path to prevent module resolution failures in Next.js Turbopack dev server
const workerPath = path.resolve(process.cwd(), "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs");
PDFParse.setWorker(pathToFileURL(workerPath).href);

export async function POST(req: NextRequest) {
  try {
    const insforge = await createInsforgeServer();
    const { data: userData, error: authError } = await insforge.auth.getCurrentUser();

    if (authError || !userData?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = userData.user.id;

    // Rate limiting check
    const rateLimit = await checkRateLimit(userId, "resume");
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: rateLimit.error },
        { status: 429 }
      );
    }

    // 1. Download PDF from InsForge Storage
    const { data: fileBlob, error: downloadError } = await insforge.storage
      .from("resumes")
      .download(`resumes/${userId}/resume.pdf`);

    if (downloadError || !fileBlob) {
      console.error("[api/resume/extract] Download error:", downloadError);
      return NextResponse.json(
        { success: false, error: "Resume file not found. Please upload a resume first." },
        { status: 404 }
      );
    }

    // 2. Parse PDF buffer to raw text using pdf-parse
    const arrayBuffer = await fileBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let extractedText = "";
    let pdfParser = null;
    try {
      pdfParser = new PDFParse({ data: buffer });
      const textResult = await pdfParser.getText();
      extractedText = textResult.text;
    } catch (parseError) {
      console.error("[api/resume/extract] PDF parse error:", parseError);
      return NextResponse.json(
        { success: false, error: "Could not parse this PDF. It might be corrupted or password-protected." },
        { status: 400 }
      );
    } finally {
      if (pdfParser) {
        try {
          await pdfParser.destroy();
        } catch (destroyError) {
          console.error("[api/resume/extract] Error destroying pdfParser:", destroyError);
        }
      }
    }
    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json(
        { success: false, error: "Could not extract text from this PDF. Please make sure it's not a scanned image and try again." },
        { status: 400 }
      );
    }

    // 3. Initialize Gemini Client
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[api/resume/extract] GEMINI_API_KEY environment variable is missing.");
      return NextResponse.json(
        { success: false, error: "AI extraction is currently unavailable (missing API configuration)." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // 4. Prompt Gemini for structured profile details matching our DB/form schema
    const prompt = `You are an expert system designed to parse resumes and extract structured professional profile data.
Analyze the following resume text and extract the candidate's profile information.

Resume Text:
"""
${extractedText}
"""

You must return a JSON object that strictly adheres to the following structure:

{
  "fullName": "Candidate's full name",
  "phone": "Candidate's phone number",
  "location": "Candidate's current city and country (e.g., 'San Francisco, CA' or 'Munich, Germany')",
  "linkedinUrl": "Candidate's LinkedIn profile URL if present, otherwise null",
  "portfolioUrl": "Candidate's portfolio or GitHub profile URL if present, otherwise null",
  "workAuthorization": "One of: 'citizen', 'permanent_resident', 'visa_required'. Default to 'citizen' if not specified in resume.",
  "currentTitle": "Candidate's current or most recent job title",
  "experienceLevel": "One of: 'junior', 'mid', 'senior', 'lead'. Match the candidate's overall career tier.",
  "yearsExperience": integer representing overall years of professional experience,
  "skills": ["array of skill tags/keywords found in the resume, normalized to short standard terms"],
  "industries": ["array of industry sectors the candidate has worked in (e.g., 'FinTech', 'Healthcare', 'E-commerce')"],
  "workExperience": [
    {
      "company": "Company name",
      "title": "Job title",
      "startDate": "Start date in YYYY-MM format. Use YYYY if month is unknown",
      "endDate": "End date in YYYY-MM format, or 'Present' if they currently work there",
      "currentlyWorking": boolean (true if this is their current job, false otherwise),
      "responsibilities": "Concise bullet-point summary of key responsibilities and achievements"
    }
  ],
  "education": {
    "degree": "One of: 'high_school', 'associate', 'bachelor', 'master', 'doctorate'. Map to the closest one.",
    "fieldOfStudy": "Major or field of study (e.g., 'Computer Science')",
    "institution": "University or school name",
    "graduationYear": "Graduation year in YYYY format"
  },
  "jobTitlesSeeking": ["list of job titles the candidate is seeking or qualified for, inferred from their experience"],
  "remotePreference": "One of: 'remote', 'onsite', 'hybrid', 'any'. Default to 'any'.",
  "salaryExpectation": "Salary expectations if specified, otherwise null",
  "preferredLocations": ["List of city or country names they prefer to work in"]
}

Constraints:
1. Provide only valid JSON. Do not include markdown code blocks or additional text outside the JSON.
2. If a field cannot be found, set it to null or an empty array (for lists).
3. The workExperience array must have a maximum of 3 entries (most recent first).
4. Strictly use the enum values specified for workAuthorization, experienceLevel, education.degree, and remotePreference.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
        maxOutputTokens: 4096,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from Gemini API");
    }

    let extractedData;
    try {
      let cleanText = responseText.trim();
      
      // 1. Remove markdown code blocks if present
      const markdownRegex = /^```(?:json)?\s*([\s\S]*?)\s*```$/i;
      const match = cleanText.match(markdownRegex);
      if (match) {
        cleanText = match[1].trim();
      }
      
      // 2. If there is text before or after the JSON block, extract the outer object
      if (!cleanText.startsWith("{") && !cleanText.startsWith("[")) {
        const jsonStart = cleanText.indexOf("{");
        const jsonEnd = cleanText.lastIndexOf("}");
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
        }
      }

      // 3. Remove trailing commas in arrays/objects (common LLM JSON generation issue)
      cleanText = cleanText.replace(/,\s*([}\]])/g, "$1");

      extractedData = JSON.parse(cleanText);
    } catch (parseJsonError) {
      console.error("[api/resume/extract] JSON parse error from Gemini text:", responseText, parseJsonError);
      throw new Error("Failed to parse AI response into structured JSON");
    }

    return NextResponse.json({
      success: true,
      data: extractedData,
    });

  } catch (error) {
    console.error("[api/resume/extract] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to extract resume data" },
      { status: 500 }
    );
  }
}
