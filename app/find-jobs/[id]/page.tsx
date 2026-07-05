import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { redirect } from "next/navigation";
import { PostHogPageView } from "@/components/PostHogPageView";
import { ChevronLeft, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Import job-details subcomponents
import { JobInfo } from "@/components/job-details/JobInfo";
import { MatchScore } from "@/components/job-details/MatchScore";
import { JobDescription } from "@/components/job-details/JobDescription";
import { CompanyResearch } from "@/components/job-details/CompanyResearch";
import { JobActions } from "@/components/job-details/JobActions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  try {
    const insforge = await createInsforgeServer();
    const { data: job } = await insforge.database
      .from("jobs")
      .select("title, company")
      .eq("id", id)
      .maybeSingle();

    if (job) {
      return {
        title: `${job.title} at ${job.company} | JobPilot`,
        description: `Detailed AI match analysis and requirements for the ${job.title} role at ${job.company}.`,
      };
    }
  } catch (error) {
    console.error("[find-jobs/[id]/page] Metadata error:", error);
  }

  return {
    title: "Job Details | JobPilot",
    description: "AI-powered job matching details",
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  let user = null;
  let job: any = null;

  try {
    const insforge = await createInsforgeServer();
    const { data: userData } = await insforge.auth.getCurrentUser();
    user = userData?.user ?? null;

    if (user) {
      const { data: dbJob, error: dbError } = await insforge.database
        .from("jobs")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (dbJob && !dbError) {
        job = dbJob;
      }
    }
  } catch (error) {
    console.error("[find-jobs/[id]/page] Error loading job details:", error);
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PostHogPageView eventName="job_details_viewed" properties={{ jobId: id }} />
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto w-full px-6 md:px-8 py-10 flex flex-col">
        {/* Back Link */}
        <Link
          href="/find-jobs"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-accent transition-colors mb-6 group w-fit"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Jobs</span>
        </Link>

        {job ? (
          <div className="space-y-6 flex-grow">
            {/* Job Header & Quick Info Grid */}
            <JobInfo
              title={job.title}
              company={job.company}
              matchScore={job.match_score}
              sourceUrl={job.source_url}
              salary={job.salary}
              location={job.location}
              jobType={job.job_type}
              foundAt={new Date(job.found_at)}
            />

            {/* AI Match Score & Skills Comparison Cards */}
            <MatchScore
              matchReason={job.match_reason || "AI match reasoning analysis is loading."}
              matchedSkills={job.matched_skills || []}
              missingSkills={job.missing_skills || []}
            />

            {/* Full Job Description Bulleted Sections */}
            <JobDescription
              aboutRole={job.about_role}
              responsibilities={job.responsibilities}
              requirements={job.requirements}
              niceToHave={job.nice_to_have}
              benefits={job.benefits}
              sourceUrl={job.source_url}
            />

            {/* Company Research Dossier Area (with Trigger Action) */}
            <CompanyResearch
              jobId={job.id}
              companyName={job.company}
              researchData={job.company_research}
            />

            {/* Primary Action Apply Bar */}
            <JobActions
              applyUrl={job.external_apply_url}
              sourceUrl={job.source_url}
            />
          </div>
        ) : (
          /* Job Not Found State */
          <div className="bg-surface border border-border rounded-2xl p-12 text-center my-auto flex flex-col items-center justify-center shadow-sm">
            <Building className="h-12 w-12 text-text-muted mb-4" />
            <h2 className="text-lg font-bold text-text-primary mb-2">Job listing not found</h2>
            <p className="text-sm text-text-secondary max-w-sm mb-6 leading-relaxed">
              We couldn't retrieve the details for this job. It may have been removed, or you don't have permission to access it.
            </p>
            <Link
              href="/find-jobs"
              className="bg-accent hover:bg-accent-dark text-accent-foreground font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors inline-flex items-center gap-2 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Find Jobs</span>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Minimal placeholder component for icon fallback in Not Found state
function Building(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="22" x2="9" y2="16" />
      <line x1="15" y1="22" x2="15" y2="16" />
      <line x1="9" y1="16" x2="15" y2="16" />
      <path d="M9 12h.01" />
      <path d="M15 12h.01" />
      <path d="M9 8h.01" />
      <path d="M15 8h.01" />
    </svg>
  );
}
