import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { getPostHogClient } from "@/lib/posthog-server";
import { discoverJobs } from "@/agent/adzuna";
import type { UserProfile } from "@/agent/types";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobTitle, location } = body as {
      jobTitle?: string;
      location?: string;
    };

    if (!jobTitle || !jobTitle.trim()) {
      return NextResponse.json(
        { success: false, error: "Job title is required" },
        { status: 400 },
      );
    }

    const insforge = await createInsforgeServer();

    // Authenticate user
    const { data: userData } = await insforge.auth.getCurrentUser();
    const user = userData?.user;
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Rate limiting check
    const rateLimit = await checkRateLimit(user.id, "search");
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: rateLimit.error },
        { status: 429 },
      );
    }

    // Load user profile for scoring
    const { data: profile, error: profileError } = await insforge.database
      .from("profiles")
      .select("id, full_name, current_title, experience_level, years_experience, skills, industries, work_experience, education, job_titles_seeking, remote_preference, preferred_locations, salary_expectation")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found. Please complete your profile first." },
        { status: 400 },
      );
    }

    // Create agent_run record
    const { data: agentRun, error: runError } = await insforge.database
      .from("agent_runs")
      .insert({
        user_id: user.id,
        status: "running",
        job_title_searched: jobTitle.trim(),
        location_searched: (location || "").trim() || null,
        jobs_found: 0,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (runError || !agentRun) {
      console.error("[agent/find]", runError);
      return NextResponse.json(
        { success: false, error: "Failed to start job search" },
        { status: 500 },
      );
    }

    const runId = (agentRun as Record<string, unknown>).id as string;

    // Fire PostHog job_search_started
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user.id,
      event: "job_search_started",
      properties: {
        userId: user.id,
        jobTitle: jobTitle.trim(),
        location: (location || "").trim(),
      },
    });

    // Run discovery pipeline
    const result = await discoverJobs(
      jobTitle.trim(),
      (location || "").trim(),
      profile as unknown as UserProfile,
      runId,
      user.id,
      insforge as Parameters<typeof discoverJobs>[5],
    );

    // Update agent_run with final status
    await insforge.database
      .from("agent_runs")
      .update({
        status: result.success ? "completed" : "failed",
        jobs_found: result.jobsFound,
        completed_at: new Date().toISOString(),
      })
      .eq("id", runId)
      .eq("user_id", user.id);

    // Fire PostHog job_found events for each discovered job
    if (result.success && result.jobsFound > 0) {
      const { data: savedJobs } = await insforge.database
        .from("jobs")
        .select("match_score")
        .eq("run_id", runId)
        .eq("user_id", user.id);

      if (savedJobs) {
        for (const job of savedJobs as { match_score: number }[]) {
          posthog.capture({
            distinctId: user.id,
            event: "job_found",
            properties: {
              userId: user.id,
              source: "search",
              matchScore: job.match_score,
            },
          });
        }
      }
    }

    await posthog.shutdown();

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Job search failed" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        jobsFound: result.jobsFound,
        strongMatches: result.strongMatches,
      },
    });
  } catch (error) {
    console.error("[agent/find]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
