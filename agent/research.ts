import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { createBrowserbaseSession } from "@/lib/browserbase";
import { createStagehandInstance } from "@/lib/stagehand";
import type { ResearchCompanyResult, ResearchDossier } from "@/agent/types";

async function logAgent(
  insforge: any,
  runId: string | null,
  userId: string,
  message: string,
  level: "info" | "success" | "warning" | "error",
  jobId?: string,
): Promise<void> {
  try {
    await insforge.database.from("agent_logs").insert({
      run_id: runId || null,
      user_id: userId,
      message,
      level,
      ...(jobId ? { job_id: jobId } : {}),
    });
  } catch (error) {
    console.error("[agent/research] Failed to write agent log:", error);
  }
}

export async function researchCompany(
  jobId: string,
  userId: string,
  insforge: any,
): Promise<ResearchCompanyResult> {
  let runId: string | null = null;
  let job: any = null;
  let profile: any = null;
  const visitedSources: string[] = [];
  let companyResearch: any = null;

  try {
    // 1. Fetch Job and Profile from DB
    const { data: dbJob, error: jobError } = await insforge.database
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .eq("user_id", userId)
      .single();

    if (jobError || !dbJob) {
      throw new Error(`Job not found: ${jobError?.message || "Unknown error"}`);
    }
    job = dbJob;
    runId = job.run_id;

    const { data: dbProfile, error: profileError } = await insforge.database
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError || !dbProfile) {
      throw new Error(`Profile not found: ${profileError?.message || "Unknown error"}`);
    }
    profile = dbProfile;

    await logAgent(
      insforge,
      runId,
      userId,
      `Starting company research for "${job.company}"`,
      "info",
      jobId,
    );

    // 2. Resolve Redirect and Homepage URL
    let resolvedUrl = job.source_url || job.external_apply_url;
    try {
      const res = await fetch(resolvedUrl, { redirect: "follow" });
      if (res.ok) {
        resolvedUrl = res.url;
      }
    } catch (err) {
      console.error("[agent/research] Redirect resolve failed:", err);
    }

    let homepageUrl = "";
    try {
      const urlObj = new URL(resolvedUrl);
      const hostname = urlObj.hostname;
      if (hostname.includes("adzuna.com")) {
        const cleanCompany = job.company
          .replace(/\s*(Inc\.?|LLC|Ltd\.?|Corp\.?|Co\.?).*$/i, "")
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "");
        homepageUrl = `https://www.${cleanCompany}.com`;
      } else {
        const parts = hostname.split(".");
        if (parts.length >= 2) {
          const rootDomain = parts.slice(-2).join(".");
          homepageUrl = `https://${rootDomain}`;
        } else {
          homepageUrl = `https://${hostname}`;
        }
      }
    } catch (err) {
      const cleanCompany = job.company
        .replace(/\s*(Inc\.?|LLC|Ltd\.?|Corp\.?|Co\.?).*$/i, "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "");
      homepageUrl = `https://www.${cleanCompany}.com`;
    }

    visitedSources.push(homepageUrl);

    // 3. Browserbase & Stagehand session
    let homepageData: any = null;
    const subPageResults: any[] = [];

    let session: any = null;
    let stagehand: any = null;

    try {
      await logAgent(
        insforge,
        runId,
        userId,
        `Opening Browserbase session for homepage: ${homepageUrl}`,
        "info",
        jobId,
      );

      session = await createBrowserbaseSession();
      stagehand = await createStagehandInstance(session.id);

      const page = stagehand.page || stagehand.context.activePage()!;

      await page.goto(homepageUrl);
      await page.waitForLoadState("networkidle");

      await logAgent(
        insforge,
        runId,
        userId,
        "Extracting homepage information...",
        "info",
        jobId,
      );

      homepageData = await stagehand.extract({
        instruction:
          "This is a company's homepage. Capture what the company actually does, who it's for, and any concrete signals (funding, customers, scale, mission, recent launches). Then find the internal links most worth visiting to research them as an employer.",
        schema: z.object({
          oneLiner: z.string().describe("What the company does in one sentence"),
          productSummary: z
            .string()
            .describe("What they build/sell and who it's for"),
          signals: z
            .array(z.string())
            .describe("Funding, notable customers, scale, mission, recent news"),
          pageLinks: z
            .array(
              z.object({
                url: z.string(),
                kind: z.enum([
                  "about",
                  "careers",
                  "blog",
                  "engineering",
                  "product",
                  "team",
                  "other",
                ]),
              }),
            )
            .describe("Internal links worth visiting"),
        }),
      });

      if (
        !homepageData ||
        (!homepageData.oneLiner && !homepageData.productSummary)
      ) {
        await logAgent(
          insforge,
          runId,
          userId,
          "Homepage returned no meaningful content. Skipping subpages.",
          "warning",
          jobId,
        );
      } else {
        const kindOrder = {
          about: 1,
          blog: 2,
          engineering: 3,
          product: 4,
          team: 5,
          careers: 6,
          other: 7,
        };
        const sortedLinks = [...(homepageData.pageLinks || [])]
          .filter((link) => link.url)
          .sort(
            (a, b) =>
              (kindOrder[a.kind as keyof typeof kindOrder] || 99) -
              (kindOrder[b.kind as keyof typeof kindOrder] || 99),
          );

        const uniqueUrls = new Set<string>();
        const subPagesToVisit: typeof homepageData.pageLinks = [];
        for (const link of sortedLinks) {
          let absoluteUrl = link.url;
          try {
            if (link.url.startsWith("/")) {
              absoluteUrl = new URL(link.url, homepageUrl).toString();
            }
          } catch (err) {
            console.error("Error resolving URL:", link.url, err);
          }
          if (!uniqueUrls.has(absoluteUrl)) {
            uniqueUrls.add(absoluteUrl);
            subPagesToVisit.push({ ...link, url: absoluteUrl });
          }
          if (subPagesToVisit.length >= 3) break;
        }

        for (const link of subPagesToVisit) {
          try {
            await logAgent(
              insforge,
              runId,
              userId,
              `Visiting subpage: ${link.url} (${link.kind})`,
              "info",
              jobId,
            );
            await page.goto(link.url);
            await page.waitForLoadState("networkidle");

            const subPageData = await stagehand.extract({
              instruction:
                "Extract substance that helps a candidate understand this company before applying: what they do, their values and how they work, the specific technologies and tools they use, notable projects or customers, and how the team operates. Ignore nav, footers, cookie banners, and generic marketing copy.",
              schema: z.object({
                keyPoints: z.array(z.string()),
                technologies: z
                  .array(z.string())
                  .describe("Specific languages, frameworks, tools, platforms"),
                valuesOrCulture: z
                  .array(z.string())
                  .describe("Stated values, working style, team norms"),
                notable: z
                  .array(z.string())
                  .describe("Customers, funding, scale, projects, awards"),
              }),
            });
            subPageResults.push(subPageData);
            visitedSources.push(link.url);
          } catch (err) {
            await logAgent(
              insforge,
              runId,
              userId,
              `Failed to extract from ${link.url}: ${String(err)}`,
              "warning",
              jobId,
            );
          }
        }
      }
    } catch (browserError) {
      await logAgent(
        insforge,
        runId,
        userId,
        `Browser research failed, falling back to LLM synthesis: ${String(browserError)}`,
        "warning",
        jobId,
      );
    } finally {
      if (stagehand) {
        try {
          await stagehand.close();
        } catch (err) {
          console.error("Error closing stagehand:", err);
        }
      }
    }

    companyResearch = {
      homepage: {
        oneLiner: homepageData?.oneLiner || "",
        productSummary: homepageData?.productSummary || "",
        signals: homepageData?.signals || [],
      },
      subPages: subPageResults,
    };

    // 4. LLM Synthesis
    await logAgent(
      insforge,
      runId,
      userId,
      "Synthesizing research dossier...",
      "info",
      jobId,
    );

    const systemPrompt = `You are a sharp career strategist preparing a candidate to apply for a specific role. You are given (a) research collected from the company's own website, (b) the job posting, and (c) the candidate's profile. Produce a concise, concrete briefing that gives this specific candidate an edge for this specific role.

Rules:
- Ground every company claim in the provided research or job posting. Never invent funding, customers, headcount, or facts. If research was thin, infer carefully from the job posting and say what's inferred.
- Be specific to THIS candidate. Connect their actual skills and past work to this company's stack, product, and values. No generic advice that would apply to anyone.
- Turn the candidate's missing skills into a strategy: how to frame the gap honestly and what adjacent experience to lean on.
- Talking points and questions must reference real things from the research, the kind of detail that signals the candidate did their homework.
- Keep every item tight: one or two sentences. No fluff.

Return ONLY valid JSON matching this shape:
{
  "companyOverview": "string",
  "techStack": ["string"],
  "culture": ["string"],
  "whyThisRole": "string",
  "yourEdge": ["string"],
  "gapsToAddress": ["string"],
  "smartQuestions": ["string"],
  "interviewPrep": ["string"],
  "sources": ["string"]
}`;

    const userPrompt = `COMPANY RESEARCH (from their website):
${JSON.stringify(companyResearch)}

JOB POSTING:
Title: ${job.title}
Company: ${job.company}
Description: ${job.about_role}
Matched skills (already computed): ${(job.matched_skills || []).join(", ")}
Missing skills (already computed): ${(job.missing_skills || []).join(", ")}

CANDIDATE PROFILE:
Current title: ${profile.current_title || "Not specified"}
Experience: ${profile.years_experience || "Not specified"} years, level ${profile.experience_level || "Not specified"}
Skills: ${(profile.skills || []).join(", ")}
Work history: ${JSON.stringify(profile.work_experience || [])}`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${systemPrompt}\n\n${userPrompt}`,
      config: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from Gemini during synthesis");
    }

    let cleanText = responseText.trim();
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

    cleanText = cleanText.replace(/,\s*([}\]])/g, "$1");
    const dossier: ResearchDossier = JSON.parse(cleanText);

    if (
      !dossier.sources ||
      !Array.isArray(dossier.sources) ||
      dossier.sources.length === 0
    ) {
      dossier.sources = visitedSources;
    }

    // 5. Save back to DB
    const { error: updateError } = await insforge.database
      .from("jobs")
      .update({ company_research: dossier })
      .eq("id", jobId)
      .eq("user_id", userId);

    if (updateError) {
      throw new Error(`Failed to update job record: ${updateError.message}`);
    }

    await logAgent(
      insforge,
      runId,
      userId,
      `Successfully completed company research for ${job.company}.`,
      "success",
      jobId,
    );
    return { success: true, dossier };
  } catch (error: any) {
    console.error("[agent/research] Research failed:", error);
    await logAgent(
      insforge,
      runId,
      userId,
      `Research failed: ${error.message || String(error)}`,
      "error",
      jobId,
    );
    return { success: false, error: error.message || String(error) };
  }
}
