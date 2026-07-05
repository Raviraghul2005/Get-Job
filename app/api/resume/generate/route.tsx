import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { GoogleGenAI } from "@google/genai";
import { renderToBuffer } from "@react-pdf/renderer";
import { ResumePDFTemplate, PolishedResumeData } from "@/components/profile/ResumePDFTemplate";
import React from "react";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const insforge = await createInsforgeServer();
    let userId = "";
    
    // TEMPORARY TEST BYPASS FOR LOCAL DEVELOPMENT VERIFICATION
    const testUserId = req.nextUrl.searchParams.get("testUserId");
    if (process.env.NODE_ENV === "development" && testUserId) {
      userId = testUserId;
      console.log(`[api/resume/generate] USING TEST BYPASS FOR USER ID: ${userId}`);
    } else {
      const { data: userData, error: authError } = await insforge.auth.getCurrentUser();

      if (authError || !userData?.user) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        );
      }
      userId = userData.user.id;
    }

    // Rate limiting check
    const rateLimit = await checkRateLimit(userId, "resume");
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: rateLimit.error },
        { status: 429 }
      );
    }

    // 1. Fetch user's profile details
    const { data: profile, error: profileError } = await insforge.database
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      console.error("[api/resume/generate] Profile fetch error:", profileError);
      return NextResponse.json(
        { success: false, error: "Could not find profile details. Please complete your profile first." },
        { status: 404 }
      );
    }

    // 2. Validate completeness server-side
    const hasName = !!profile.full_name?.trim();
    const hasEmail = !!profile.email?.trim();
    const hasSkills = Array.isArray(profile.skills) && profile.skills.length > 0;
    const hasExperience = Array.isArray(profile.work_experience) && profile.work_experience.length > 0;
    const hasEducation = Array.isArray(profile.education) && profile.education.length > 0 && !!profile.education[0]?.institution?.trim();

    if (!hasName || !hasEmail || !hasSkills || (!hasExperience && !hasEducation)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Your profile is incomplete. Please ensure you have filled out your name, email, skills, and at least one work experience or education entry." 
        },
        { status: 400 }
      );
    }

    // 3. Initialize Gemini client
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[api/resume/generate] GEMINI_API_KEY environment variable is missing.");
      return NextResponse.json(
        { success: false, error: "AI resume generation is currently unavailable (missing API configuration)." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format profile information for the prompt
    const rawEducation = Array.isArray(profile.education) ? profile.education[0] : profile.education;
    const promptData = {
      fullName: profile.full_name,
      currentTitle: profile.current_title || "Professional",
      skills: profile.skills,
      experienceLevel: profile.experience_level,
      yearsExperience: profile.years_experience,
      workExperience: profile.work_experience || [],
      education: rawEducation || null,
    };

    const prompt = `You are a professional resume writer and career strategist.
Your task is to take a candidate's raw profile details and rewrite them into polished, high-impact resume content.

Candidate Details:
${JSON.stringify(promptData, null, 2)}

Requirements:
1. Generate an impact-focused professional summary paragraph (2-3 sentences max).
2. For each work experience entry (maximum of 3), keep the company and job title, format the start and end dates as a readable date range (e.g., "Jan 2021 - Present" or "2018 - 2020"), and rewrite their responsibilities into 3-4 professional bullet points. Each bullet point should start with an action verb and highlight concrete business achievements, outcomes, or scale.
3. For education, format the degree cleanly (e.g., "Bachelor of Science in Computer Science") and provide the graduation year (e.g., "2020").
4. Filter/deduplicate and return the top 8-12 key skills from the candidate's list that are most relevant to their professional path.

You must return a JSON object that strictly adheres to the following structure:
{
  "summary": "Polished professional summary paragraph",
  "workExperience": [
    {
      "company": "Company Name",
      "title": "Job Title",
      "dateRange": "Start Date - End Date",
      "bullets": [
        "Action-oriented bullet 1",
        "Action-oriented bullet 2",
        "Action-oriented bullet 3"
      ]
    }
  ],
  "education": {
    "institution": "University or Institution name",
    "degree": "Polished Degree name (e.g. Bachelor of Science in Chemistry)",
    "date": "Graduation year"
  },
  "skills": ["Skill 1", "Skill 2", "Skill 3"]
}

Constraints:
- Return ONLY valid JSON. Do not wrap in markdown code blocks or add introductory/explanatory text.
- If education data is missing, return empty strings for the education fields.
- Limit work experience to the 3 most recent roles.
`;

    // 4. Generate polished copy with Gemini 2.5 Flash
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

    let polishedContent;
    try {
      let cleanText = responseText.trim();
      // Remove markdown code blocks if present
      const markdownRegex = /^```(?:json)?\s*([\s\S]*?)\s*```$/i;
      const match = cleanText.match(markdownRegex);
      if (match) {
        cleanText = match[1].trim();
      }

      if (!cleanText.startsWith("{") && !cleanText.startsWith("[")) {
        const jsonStart = cleanText.indexOf("{");
        const jsonEnd = cleanText.lastIndexOf("}");
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
        }
      }

      // Remove trailing commas
      cleanText = cleanText.replace(/,\s*([}\]])/g, "$1");

      polishedContent = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("[api/resume/generate] JSON parse error on response:", responseText, parseError);
      return NextResponse.json(
        { success: false, error: "Failed to parse generated resume content from Gemini." },
        { status: 500 }
      );
    }

    // Combine polished copy with raw profile contact information for rendering
    const templateData: PolishedResumeData = {
      fullName: profile.full_name,
      email: profile.email,
      phone: profile.phone || undefined,
      location: profile.location || undefined,
      linkedinUrl: profile.linkedin_url || undefined,
      portfolioUrl: profile.portfolio_url || undefined,
      currentTitle: profile.current_title || undefined,
      workAuthorization: profile.work_authorization || undefined,
      summary: polishedContent.summary,
      workExperience: polishedContent.workExperience,
      education: polishedContent.education,
      skills: polishedContent.skills,
      jobTitlesSeeking: profile.job_titles_seeking || undefined,
      remotePreference: profile.remote_preference || undefined,
      salaryExpectation: profile.salary_expectation || undefined,
      preferredLocations: profile.preferred_locations || undefined,
    };

    // 5. Render PDF into buffer
    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await renderToBuffer(<ResumePDFTemplate data={templateData} />);
    } catch (pdfError) {
      console.error("[api/resume/generate] PDF rendering error:", pdfError);
      return NextResponse.json(
        { success: false, error: "Failed to render PDF document." },
        { status: 500 }
      );
    }

    // If download parameter is specified in development, return the PDF directly as attachment
    const download = req.nextUrl.searchParams.get("download");
    if (process.env.NODE_ENV === "development" && download === "true") {
      return new Response(new Uint8Array(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=\"resume-test.pdf\"",
        },
      });
    }

    // Delete existing resume from storage if it exists to maintain consistency
    try {
      await insforge.storage.from("resumes").remove(`resumes/${userId}/resume.pdf`);
    } catch (removeError) {
      console.warn("[api/resume/generate] Failed to remove old resume (it may not exist):", removeError);
    }

    // 6. Upload PDF to InsForge Storage bucket
    const pdfBlob = new Blob([new Uint8Array(pdfBuffer)], { type: "application/pdf" });
    const { data: uploadData, error: uploadError } = await insforge.storage
      .from("resumes")
      .upload(`resumes/${userId}/resume.pdf`, pdfBlob);

    if (uploadError || !uploadData?.url) {
      console.error("[api/resume/generate] Storage upload error:", uploadError);
      return NextResponse.json(
        { success: false, error: uploadError?.message || "Failed to upload resume to storage." },
        { status: 500 }
      );
    }

    const downloadUrl = "/api/resume/download";

    // 7. Update database profiles table with authenticated download url
    const { error: dbUpdateError } = await insforge.database
      .from("profiles")
      .update({
        resume_pdf_url: downloadUrl,
      })
      .eq("id", userId);

    if (dbUpdateError) {
      console.error("[api/resume/generate] Database update error:", dbUpdateError);
      return NextResponse.json(
        { success: false, error: "Failed to update resume reference in profile database." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: downloadUrl,
    });

  } catch (error) {
    console.error("[api/resume/generate] Unexpected error in resume generator:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to generate resume" },
      { status: 500 }
    );
  }
}
