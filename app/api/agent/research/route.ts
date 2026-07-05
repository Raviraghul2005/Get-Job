import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { getPostHogClient } from "@/lib/posthog-server";
import { researchCompany } from "@/agent/research";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId } = body as { jobId?: string };

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "jobId is required" },
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
    const rateLimit = await checkRateLimit(user.id, "research");
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: rateLimit.error },
        { status: 429 },
      );
    }

    // Load job first to get the company name for PostHog properties
    const { data: job } = await insforge.database
      .from("jobs")
      .select("company")
      .eq("id", jobId)
      .eq("user_id", user.id)
      .single();

    const company = job?.company || "Unknown";

    // Run the company research agent
    const result = await researchCompany(jobId, user.id, insforge);

    if (result.success && result.dossier) {
      // Fire PostHog event
      const posthog = getPostHogClient();
      posthog.capture({
        distinctId: user.id,
        event: "company_researched",
        properties: {
          userId: user.id,
          jobId,
          company,
        },
      });
      await posthog.shutdown();

      return NextResponse.json({
        success: true,
        data: result.dossier,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || "Research agent failed" },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("[api/agent/research] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
