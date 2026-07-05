interface ActivityItem {
  id: string;
  text: string;
  timestamp: string;
  type: "search" | "research";
  dotColorClass: {
    outer: string;
    inner: string;
  };
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export type { ActivityItem };

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col h-full min-h-[448px]">
        <h2 className="text-base font-semibold text-text-primary mb-6">Recent Activity</h2>
        <div className="flex-grow flex items-center justify-center">
          <p className="text-sm text-text-muted">No activity yet. Start finding jobs!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col h-full min-h-[448px]">
      <h2 className="text-base font-semibold text-text-primary mb-6">Recent Activity</h2>

      <div className="flex flex-col">
        {activities.map((activity, index) => {
          const isLast = index === activities.length - 1;

          return (
            <div key={activity.id} className="flex gap-4 relative pb-6 last:pb-0">
              {/* Vertical connecting line */}
              {!isLast && (
                <div
                  className="absolute left-[7px] top-5 bottom-0 w-[2px] bg-border-light"
                />
              )}

              {/* Status Dot */}
              <div className="relative flex items-center justify-center w-4 h-4 mt-1 z-10">
                <div className={`w-4 h-4 rounded-full border-2 border-surface ${activity.dotColorClass.outer} flex items-center justify-center`}>
                  <div className={`w-2 h-2 rounded-full ${activity.dotColorClass.inner}`} />
                </div>
              </div>

              {/* Text details */}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text-primary">
                  {activity.text}
                </span>
                <span className="text-xs text-text-muted mt-0.5">
                  {activity.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

