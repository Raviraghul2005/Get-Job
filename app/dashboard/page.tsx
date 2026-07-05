import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { redirect } from "next/navigation";
import { PostHogPageView } from "@/components/PostHogPageView";
import { calculateCompletion } from "@/actions/profile";
import { formatTimeAgo } from "@/lib/utils";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import type { ActivityItem } from "@/components/dashboard/RecentActivity";
import { ProfileBanner } from "@/components/dashboard/ProfileBanner";
import {
  CompanyResearchChart,
  JobsFoundChart,
  MatchScoreChart,
} from "@/components/dashboard/AnalyticsCharts";

export const dynamic = "force-dynamic";

type JobRow = {
  id: string;
  match_score: number | null;
  company_research: unknown;
  found_at: string;
};

async function fetchDashboardStats(userId: string): Promise<{
  totalJobsFound: number;
  avgMatchRate: number;
  companiesResearched: number;
  jobsThisWeek: number;
}> {
  try {
    const insforge = await createInsforgeServer();

    const { data: jobs, error } = await insforge.database
      .from("jobs")
      .select("id, match_score, company_research, found_at")
      .eq("user_id", userId);

    if (error || !jobs) {
      console.error("[dashboard/page] Error fetching jobs for stats:", error);
      return { totalJobsFound: 0, avgMatchRate: 0, companiesResearched: 0, jobsThisWeek: 0 };
    }

    const typedJobs = jobs as JobRow[];

    const totalJobsFound = typedJobs.length;

    const scoresWithValues = typedJobs
      .map((j) => j.match_score)
      .filter((s): s is number => s !== null && s !== undefined);
    const avgMatchRate = scoresWithValues.length > 0
      ? Math.round(scoresWithValues.reduce((sum, s) => sum + s, 0) / scoresWithValues.length)
      : 0;

    const companiesResearched = typedJobs.filter(
      (j) =>
        j.company_research !== null &&
        j.company_research !== undefined &&
        typeof j.company_research === "object" &&
        Object.keys(j.company_research as Record<string, unknown>).length > 0
    ).length;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const jobsThisWeek = typedJobs.filter(
      (j) => new Date(j.found_at) >= oneWeekAgo
    ).length;

    return { totalJobsFound, avgMatchRate, companiesResearched, jobsThisWeek };
  } catch (error) {
    console.error("[dashboard/page] Unexpected error fetching stats:", error);
    return { totalJobsFound: 0, avgMatchRate: 0, companiesResearched: 0, jobsThisWeek: 0 };
  }
}

type AgentRunRow = {
  id: string;
  status: string;
  job_title_searched: string | null;
  jobs_found: number | null;
  completed_at: string | null;
};

type ResearchJobRow = {
  id: string;
  company: string | null;
  found_at: string;
};

type AgentLogResult = {
  job_id: string | null;
  created_at: string;
};

async function fetchRecentActivities(userId: string): Promise<ActivityItem[]> {
  try {
    const insforge = await createInsforgeServer();

    // Fetch recent completed agent runs
    const { data: agentRuns, error: runsError } = await insforge.database
      .from("agent_runs")
      .select("id, status, job_title_searched, jobs_found, completed_at")
      .eq("user_id", userId)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(10);

    // Fetch recent company research entries (exclude empty {} objects)
    const { data: researchJobs, error: researchError } = await insforge.database
      .from("jobs")
      .select("id, company, found_at")
      .eq("user_id", userId)
      .not("company_research", "is", null)
      .neq("company_research", "{}")
      .order("found_at", { ascending: false })
      .limit(10);

    // Fetch the actual completion timestamps for company research from agent logs
    const { data: logs, error: logsError } = await insforge.database
      .from("agent_logs")
      .select("job_id, created_at")
      .eq("user_id", userId)
      .like("message", "Successfully completed company research for%")
      .order("created_at", { ascending: false });

    if (runsError) {
      console.error("[dashboard/page] Error fetching agent runs:", runsError);
    }
    if (researchError) {
      console.error("[dashboard/page] Error fetching research jobs:", researchError);
    }
    if (logsError) {
      console.error("[dashboard/page] Error fetching research logs:", logsError);
    }

    // Map job_id to actual research completion timestamp
    const researchTimeMap = new Map<string, string>();
    if (logs) {
      const typedLogs = logs as AgentLogResult[];
      for (const log of typedLogs) {
        if (log.job_id && !researchTimeMap.has(log.job_id)) {
          researchTimeMap.set(log.job_id, log.created_at);
        }
      }
    }

    const activities: { item: ActivityItem; sortDate: Date }[] = [];

    // Format agent runs → "Found X jobs for [jobTitle]"
    const typedRuns = (agentRuns || []) as AgentRunRow[];
    for (const run of typedRuns) {
      const completedDate = run.completed_at ? new Date(run.completed_at) : new Date();
      const jobCount = run.jobs_found ?? 0;
      const title = run.job_title_searched || "jobs";

      activities.push({
        sortDate: completedDate,
        item: {
          id: `run-${run.id}`,
          text: `Found ${jobCount} jobs for ${title}`,
          timestamp: formatTimeAgo(completedDate),
          type: "search",
          dotColorClass: {
            outer: "bg-success-light",
            inner: "bg-success-alt",
          },
        },
      });
    }

    // Format company research → "Researched [company]"
    const typedResearch = (researchJobs || []) as ResearchJobRow[];
    for (const job of typedResearch) {
      const logTime = researchTimeMap.get(job.id);
      const researchDate = logTime ? new Date(logTime) : new Date(job.found_at);
      const company = job.company || "a company";

      activities.push({
        sortDate: researchDate,
        item: {
          id: `research-${job.id}`,
          text: `Researched ${company}`,
          timestamp: formatTimeAgo(researchDate),
          type: "research",
          dotColorClass: {
            outer: "bg-info-light",
            inner: "bg-info",
          },
        },
      });
    }

    // Sort by date descending and take the 5 most recent
    activities.sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());
    return activities.slice(0, 5).map((a) => a.item);
  } catch (error) {
    console.error("[dashboard/page] Unexpected error fetching activities:", error);
    return [];
  }
}

import type { ChartDataItem } from "@/components/dashboard/AnalyticsCharts";

async function fetchJobsFoundData(userId: string): Promise<ChartDataItem[]> {
  try {
    const insforge = await createInsforgeServer();
    
    // Calculate date range (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: jobs, error } = await insforge.database
      .from("jobs")
      .select("found_at")
      .eq("user_id", userId)
      .gte("found_at", thirtyDaysAgo.toISOString());

    if (error) {
      console.error("[dashboard/page] Error fetching jobs for chart:", error);
      return [];
    }

    // Initialize the last 30 days with 0 counts
    const chartData: ChartDataItem[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
      chartData.push({ label, value: 0 });
    }

    // Populate counts
    if (jobs) {
      for (const job of jobs) {
        if (job.found_at) {
          const jobDate = new Date(job.found_at);
          const label = jobDate.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
          const item = chartData.find((d) => d.label === label);
          if (item) {
            item.value++;
          }
        }
      }
    }

    return chartData;
  } catch (error) {
    console.error("[dashboard/page] Unexpected error in fetchJobsFoundData:", error);
    return [];
  }
}

async function fetchMatchScoreDistribution(userId: string): Promise<ChartDataItem[]> {
  try {
    const insforge = await createInsforgeServer();
    
    const { data: jobs, error } = await insforge.database
      .from("jobs")
      .select("match_score")
      .eq("user_id", userId)
      .not("match_score", "is", null);

    if (error) {
      console.error("[dashboard/page] Error fetching match scores for chart:", error);
      return [];
    }

    const distribution: ChartDataItem[] = [
      { label: "50-60%", value: 0 },
      { label: "60-70%", value: 0 },
      { label: "70-80%", value: 0 },
      { label: "80-90%", value: 0 },
      { label: "90-100%", value: 0 },
    ];

    if (jobs) {
      for (const job of jobs) {
        const score = job.match_score;
        if (score !== null && score !== undefined) {
          if (score >= 50 && score < 60) distribution[0].value++;
          else if (score >= 60 && score < 70) distribution[1].value++;
          else if (score >= 70 && score < 80) distribution[2].value++;
          else if (score >= 80 && score < 90) distribution[3].value++;
          else if (score >= 90 && score <= 100) distribution[4].value++;
        }
      }
    }

    return distribution;
  } catch (error) {
    console.error("[dashboard/page] Unexpected error in fetchMatchScoreDistribution:", error);
    return [];
  }
}

async function fetchCompanyResearchActivity(userId: string): Promise<ChartDataItem[]> {
  try {
    const insforge = await createInsforgeServer();
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: logs, error } = await insforge.database
      .from("agent_logs")
      .select("created_at")
      .eq("user_id", userId)
      .like("message", "Successfully completed company research for%")
      .gte("created_at", sevenDaysAgo.toISOString());

    if (error) {
      console.error("[dashboard/page] Error fetching research logs for chart:", error);
      return [];
    }

    // Initialize the last 7 days with 0 counts
    const chartData: ChartDataItem[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const label = date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
      chartData.push({ label, value: 0 });
    }

    // Populate counts
    if (logs) {
      for (const log of logs) {
        if (log.created_at) {
          const logDate = new Date(log.created_at);
          const label = logDate.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
          const item = chartData.find((d) => d.label === label);
          if (item) {
            item.value++;
          }
        }
      }
    }

    return chartData;
  } catch (error) {
    console.error("[dashboard/page] Unexpected error in fetchCompanyResearchActivity:", error);
    return [];
  }
}

export default async function DashboardPage() {
  let user = null;
  let profile = null;

  try {
    const insforge = await createInsforgeServer();
    const { data: userData } = await insforge.auth.getCurrentUser();
    user = userData?.user ?? null;

    if (user) {
      const { data: profileData } = await insforge.database
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      profile = profileData;
    }
  } catch (error) {
    console.error("[dashboard/page] Error initializing dashboard:", error);
  }

  if (!user) {
    redirect("/login");
  }

  const { percentage } = await calculateCompletion(profile || {});

  const [stats, activities, jobsFoundData, matchScoreDistribution, companyResearchActivity] = await Promise.all([
    fetchDashboardStats(user.id),
    fetchRecentActivities(user.id),
    fetchJobsFoundData(user.id),
    fetchMatchScoreDistribution(user.id),
    fetchCompanyResearchActivity(user.id),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PostHogPageView eventName="dashboard_viewed" />
      <Navbar />

      <main className="flex-grow max-w-[1440px] mx-auto w-full px-6 md:px-8 py-10 flex flex-col gap-6">
        {/* Profile Completeness Warning Banner */}
        <ProfileBanner percentage={percentage} />

        {/* Stats Bar — Real Data */}
        <StatsBar
          totalJobsFound={stats.totalJobsFound}
          avgMatchRate={stats.avgMatchRate}
          companiesResearched={stats.companiesResearched}
          jobsThisWeek={stats.jobsThisWeek}
        />

        {/* Middle Grid: Recent Activity & Company Research Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity activities={activities} />
          <CompanyResearchChart data={companyResearchActivity} />
        </div>

        {/* Bottom Grid: Jobs Found Over Time & Match Score Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <JobsFoundChart data={jobsFoundData} />
          </div>
          <div className="lg:col-span-1">
            <MatchScoreChart data={matchScoreDistribution} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
