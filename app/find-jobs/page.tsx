import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { redirect } from "next/navigation";
import { PostHogPageView } from "@/components/PostHogPageView";
import { FindJobsContainer } from "@/components/find-jobs/FindJobsContainer";

export const dynamic = "force-dynamic";

export default async function FindJobsPage() {
  let user = null;
  let initialJobs: any[] = [];

  try {
    const insforge = await createInsforgeServer();
    const { data: userData } = await insforge.auth.getCurrentUser();
    user = userData?.user ?? null;

    if (user) {
      const { data: dbJobs, error: dbError } = await insforge.database
        .from("jobs")
        .select("*")
        .eq("user_id", user.id)
        .order("found_at", { ascending: false });

      if (dbJobs && !dbError) {
        initialJobs = dbJobs.map((dbJob: any) => ({
          id: dbJob.id,
          company: dbJob.company,
          role: dbJob.title,
          matchScore: dbJob.match_score,
          salaryEst: dbJob.salary || "Not specified",
          dateFound: new Date(dbJob.found_at),
          source: dbJob.source,
        }));
      }
    }
  } catch (error) {
    console.error("[find-jobs/page] Error initializing page:", error);
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PostHogPageView eventName="find_jobs_viewed" />
      <Navbar />

      <main className="flex-grow max-w-[1440px] mx-auto w-full px-6 md:px-8 py-10">
        <FindJobsContainer initialJobs={initialJobs} />
      </main>

      <Footer />
    </div>
  );
}
