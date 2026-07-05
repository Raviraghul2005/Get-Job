import { searchJobs } from "@/lib/adzuna";
import { detectCountry, MATCH_THRESHOLD } from "@/lib/utils";
import { scoreJobAgainstProfile } from "@/agent/matcher";
import type {
  AdzunaJob,
  UserProfile,
  ScoredJob,
  DiscoverJobsResult,
} from "@/agent/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
type InsforgeClient = {
  database: {
    from: (table: string) => any;
  };
};
/* eslint-enable @typescript-eslint/no-explicit-any */

async function logAgent(
  insforge: InsforgeClient,
  runId: string,
  userId: string,
  message: string,
  level: "info" | "success" | "warning" | "error",
  jobId?: string,
): Promise<void> {
  try {
    await insforge.database.from("agent_logs").insert({
      run_id: runId,
      user_id: userId,
      message,
      level,
      ...(jobId ? { job_id: jobId } : {}),
    });
  } catch (error) {
    console.error("[agent/adzuna] Failed to write agent log:", error);
  }
}

function mapToJobRecord(
  job: AdzunaJob,
  scored: ScoredJob,
  userId: string,
  runId: string,
): Record<string, unknown> {
  return {
    user_id: userId,
    run_id: runId,
    source: "search",
    source_url: job.redirect_url,
    external_apply_url: job.redirect_url,
    title: job.title,
    company: job.company.display_name,
    location: job.location.display_name,
    salary:
      job.salary_min
        ? `$${Math.round(job.salary_min / 1000)}k - $${Math.round(job.salary_max! / 1000)}k`
        : null,
    job_type: job.contract_type || "fulltime",
    about_role: job.description,
    match_score: scored.matchScore,
    match_reason: scored.matchReason,
    matched_skills: scored.matchedSkills,
    missing_skills: scored.missingSkills,
    found_at: new Date().toISOString(),
  };
}

export async function discoverJobs(
  jobTitle: string,
  location: string,
  profile: UserProfile,
  runId: string,
  userId: string,
  insforge: InsforgeClient,
): Promise<DiscoverJobsResult> {
  try {
    const country = detectCountry(location);

    await logAgent(insforge, runId, userId, `Starting job search: "${jobTitle}" in "${location || "anywhere"}" (country: ${country})`, "info");

    // Step 1 — Call Adzuna API
    const adzunaJobs = await searchJobs(jobTitle, location, country);

    if (adzunaJobs.length === 0) {
      await logAgent(insforge, runId, userId, "Adzuna returned no results for this search.", "warning");
      return { success: true, jobsFound: 0, strongMatches: 0 };
    }

    await logAgent(insforge, runId, userId, `Adzuna returned ${adzunaJobs.length} jobs. Scoring against profile...`, "info");

    // Step 2 — Score all jobs in parallel with Gemini
    const scoringResults = await Promise.allSettled(
      adzunaJobs.map((job) => scoreJobAgainstProfile(job, profile)),
    );

    // Step 3 — Pair Adzuna jobs with scores, skip rejected promises
    const jobRecords: Record<string, unknown>[] = [];
    for (let i = 0; i < adzunaJobs.length; i++) {
      const result = scoringResults[i];
      if (result.status === "fulfilled") {
        jobRecords.push(
          mapToJobRecord(adzunaJobs[i], result.value, userId, runId),
        );
      } else {
        await logAgent(
          insforge,
          runId,
          userId,
          `Scoring failed for "${adzunaJobs[i].title}" at ${adzunaJobs[i].company.display_name}: ${String(result.reason)}`,
          "error",
        );
      }
    }

    if (jobRecords.length === 0) {
      await logAgent(insforge, runId, userId, "All scoring attempts failed. No jobs saved.", "error");
      return { success: false, jobsFound: 0, strongMatches: 0, error: "All scoring attempts failed" };
    }

    // Step 4 — Batch insert all scored jobs
    const { error: insertError } = await insforge.database
      .from("jobs")
      .insert(jobRecords);

    if (insertError) {
      await logAgent(insforge, runId, userId, `Failed to insert jobs: ${String(insertError)}`, "error");
      return { success: false, jobsFound: 0, strongMatches: 0, error: "Failed to save jobs to database" };
    }

    const strongMatches = jobRecords.filter(
      (j) => (j.match_score as number) >= MATCH_THRESHOLD,
    ).length;

    await logAgent(
      insforge,
      runId,
      userId,
      `Saved ${jobRecords.length} jobs (${strongMatches} strong matches with score ≥ ${MATCH_THRESHOLD}).`,
      "success",
    );

    return {
      success: true,
      jobsFound: jobRecords.length,
      strongMatches,
    };
  } catch (error) {
    await logAgent(insforge, runId, userId, `Discovery failed: ${String(error)}`, "error");
    return { success: false, jobsFound: 0, strongMatches: 0, error: String(error) };
  }
}
