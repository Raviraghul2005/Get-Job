import { AlertCircle, CheckCircle2 } from "lucide-react";

type CompletionBannerProps = {
  percentage: number;
  missingFields: string[];
};

export function CompletionBanner({ percentage, missingFields }: CompletionBannerProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Dynamic values based on completion percentage
  let strokeColor = "var(--color-error)";
  let iconColorClass = "text-error";
  let HeaderIcon = AlertCircle;
  let headerText = "Profile needs attention";
  let descriptionText = "Complete the missing fields to improve your chance of getting tailored matches and generating quality resumes.";

  if (percentage === 100) {
    strokeColor = "var(--color-success)";
    iconColorClass = "text-success";
    HeaderIcon = CheckCircle2;
    headerText = "Profile complete!";
    descriptionText = "Your profile is fully completed! You are ready to search for jobs, get tailored matches, and generate polished resumes.";
  } else if (percentage >= 80) {
    strokeColor = "var(--color-success)";
    iconColorClass = "text-success";
    HeaderIcon = CheckCircle2;
    headerText = "Profile looking good";
    descriptionText = "Almost there! Complete the remaining fields to maximize your chance of getting tailored matches.";
  } else if (percentage >= 50) {
    strokeColor = "var(--color-warning)";
    iconColorClass = "text-warning";
    HeaderIcon = AlertCircle;
    headerText = "Profile needs attention";
    descriptionText = "Complete the missing fields to improve your chance of getting tailored matches and generating resumes.";
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <HeaderIcon className={`h-5 w-5 ${iconColorClass}`} />
            <h2 className="text-base font-semibold text-text-primary">{headerText}</h2>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed max-w-md">
            {descriptionText}
          </p>
          {missingFields.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {missingFields.map((field) => (
                <span
                  key={field}
                  className="text-xs font-semibold text-accent uppercase tracking-wider bg-accent-muted border border-accent-light px-2 py-0.5 rounded-full"
                >
                  {field}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Circular progress ring */}
        <div className="relative flex-shrink-0 h-[100px] w-[100px]">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-semibold text-text-primary">{percentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
