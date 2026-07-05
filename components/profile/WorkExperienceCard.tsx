"use client";

type WorkExperienceCardProps = {
  index: number;
  role: {
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    responsibilities: string;
  };
  onUpdate: (index: number, field: string, value: string | boolean) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
};

export function WorkExperienceCard({
  index,
  role,
  onUpdate,
  onRemove,
  canRemove,
}: WorkExperienceCardProps) {
  return (
    <div className="border border-border rounded-xl p-5 space-y-4">
      {canRemove && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-xs text-text-muted hover:text-error transition-colors"
          >
            Remove
          </button>
        </div>
      )}

      {/* Company Name + Job Title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Company Name
          </label>
          <input
            type="text"
            value={role.company}
            onChange={(e) => onUpdate(index, "company", e.target.value)}
            placeholder="E.g. Google"
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Job Title
          </label>
          <input
            type="text"
            value={role.title}
            onChange={(e) => onUpdate(index, "title", e.target.value)}
            placeholder="E.g. Frontend Engineer"
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Start Date + End Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Start Date
          </label>
          <input
            type="month"
            value={role.startDate}
            onChange={(e) => onUpdate(index, "startDate", e.target.value)}
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
              End Date
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={role.currentlyWorking}
                onChange={(e) => onUpdate(index, "currentlyWorking", e.target.checked)}
                className="h-3.5 w-3.5 rounded border-border text-accent focus:ring-accent"
              />
              <span className="text-xs text-text-secondary">Currently working here</span>
            </label>
          </div>
          <input
            type="month"
            value={role.endDate}
            onChange={(e) => onUpdate(index, "endDate", e.target.value)}
            disabled={role.currentlyWorking}
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary disabled:bg-surface-secondary disabled:text-text-muted disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Key Responsibilities */}
      <div>
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
          Key Responsibilities
        </label>
        <textarea
          value={role.responsibilities}
          onChange={(e) => onUpdate(index, "responsibilities", e.target.value)}
          placeholder="Describe your key responsibilities and achievements..."
          rows={3}
          className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors resize-none"
        />
      </div>
    </div>
  );
}
