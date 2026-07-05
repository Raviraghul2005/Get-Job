interface StatsBarProps {
  totalJobsFound: number;
  avgMatchRate: number;
  companiesResearched: number;
  jobsThisWeek: number;
}

export function StatsBar({
  totalJobsFound,
  avgMatchRate,
  companiesResearched,
  jobsThisWeek,
}: StatsBarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Jobs Found */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between h-[132px]">
        <span className="text-sm font-medium text-text-secondary">Total Jobs Found</span>
        <div className="flex flex-col gap-1 mt-2">
          <span className="text-[30px] font-semibold leading-[36px] text-text-primary">
            {totalJobsFound}
          </span>
          <span className="text-xs font-normal text-text-muted mt-2">
            All time
          </span>
        </div>
      </div>

      {/* Avg. Match Rate */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between h-[132px]">
        <span className="text-sm font-medium text-text-secondary">Avg. Match Rate</span>
        <div className="flex flex-col gap-1 mt-2">
          <span className="text-[30px] font-semibold leading-[36px] text-text-primary">
            {avgMatchRate}%
          </span>
          <span className="text-xs font-normal text-text-muted mt-2">
            Across all jobs
          </span>
        </div>
      </div>

      {/* Companies Researched */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between h-[132px]">
        <span className="text-sm font-medium text-text-secondary">Companies Researched</span>
        <div className="flex flex-col gap-1 mt-2">
          <span className="text-[30px] font-semibold leading-[36px] text-text-primary">
            {companiesResearched}
          </span>
          <span className="text-xs font-normal text-text-muted mt-2">
            Total researched
          </span>
        </div>
      </div>

      {/* Jobs This Week */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between h-[132px]">
        <span className="text-sm font-medium text-text-secondary">Jobs This Week</span>
        <div className="flex flex-col gap-1 mt-2">
          <span className="text-[30px] font-semibold leading-[36px] text-text-primary">
            {jobsThisWeek}
          </span>
          <span className="text-xs font-normal text-text-muted mt-2">
            New this week
          </span>
        </div>
      </div>
    </div>
  );
}
