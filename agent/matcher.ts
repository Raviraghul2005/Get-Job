import type { AdzunaJob, ScoredJob, UserProfile } from "@/agent/types";

const SCORING_SYSTEM_PROMPT = `You are a job matching expert. Given a job listing and a candidate profile, score how well the candidate matches this specific role.

Rules:
- matchScore is an integer 0-100. Be realistic — a perfect match is rare.
- matchReason is one paragraph explaining why this score was given. Be specific to this job and this candidate.
- matchedSkills lists skills the candidate HAS that this job requires or values.
- missingSkills lists skills this job requires that the candidate LACKS.
- Only include skills actually mentioned or implied in the job description.
- If the candidate profile is sparse, score conservatively and note what's missing.

Return ONLY valid JSON matching this shape:
{
  "matchScore": number,
  "matchReason": "string",
  "matchedSkills": ["string"],
  "missingSkills": ["string"]
}`;

function buildUserPrompt(job: AdzunaJob, profile: UserProfile): string {
  return `JOB LISTING:
Title: ${job.title}
Company: ${job.company.display_name}
Location: ${job.location.display_name}
Description: ${job.description}

CANDIDATE PROFILE:
Current title: ${profile.current_title || "Not specified"}
Experience: ${profile.years_experience || "Not specified"} years, level: ${profile.experience_level || "Not specified"}
Skills: ${profile.skills?.join(", ") || "None listed"}
Industries: ${profile.industries?.join(", ") || "None listed"}
Job titles seeking: ${profile.job_titles_seeking?.join(", ") || "Not specified"}
Remote preference: ${profile.remote_preference || "Not specified"}
Work history: ${profile.work_experience ? JSON.stringify(profile.work_experience) : "None listed"}`;
}

export async function scoreJobAgainstProfile(
  job: AdzunaJob,
  profile: UserProfile,
): Promise<ScoredJob> {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SCORING_SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(job, profile) },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API returned status ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Empty message content returned from Groq");
    }

    const parsed = JSON.parse(content) as ScoredJob;

    return {
      matchScore: Math.max(0, Math.min(100, parsed.matchScore)),
      matchReason: parsed.matchReason || "Unable to determine match reason.",
      matchedSkills: parsed.matchedSkills || [],
      missingSkills: parsed.missingSkills || [],
    };
  } catch (error) {
    console.error("[agent/matcher] Scoring failed for job:", job.title, error);
    return {
      matchScore: 0,
      matchReason: "Scoring failed — unable to evaluate this job against your profile.",
      matchedSkills: [],
      missingSkills: [],
    };
  }
}
