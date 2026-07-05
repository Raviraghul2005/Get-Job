import { Search } from "lucide-react";

interface JobsFilterBarProps {
  textFilter: string;
  setTextFilter: (val: string) => void;
  matchFilter: string;
  setMatchFilter: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
}

export function JobsFilterBar({
  textFilter,
  setTextFilter,
  matchFilter,
  setMatchFilter,
  sortBy,
  setSortBy,
}: JobsFilterBarProps) {
  const selectClasses =
    "bg-surface border border-border rounded-md pl-4 pr-10 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors appearance-none cursor-pointer w-full md:w-auto min-w-[140px]";

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Text filter input */}
      <div className="relative w-full md:max-w-md">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-text-muted" />
        </span>
        <input
          type="text"
          value={textFilter}
          onChange={(e) => setTextFilter(e.target.value)}
          placeholder="Filter by company or role..."
          className="bg-surface border border-border rounded-md pl-10 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent w-full outline-none"
        />
      </div>

      {/* Dropdown controls */}
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
        {/* Match filter tabs */}
        <div className="flex items-center bg-surface-secondary border border-border p-1 rounded-lg gap-1">
          <button
            type="button"
            onClick={() => setMatchFilter("all")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              matchFilter === "all"
                ? "bg-surface text-accent shadow-sm border border-border/50"
                : "text-text-secondary hover:text-text-primary border border-transparent"
            }`}
          >
            All Matches
          </button>
          <button
            type="button"
            onClick={() => setMatchFilter("high")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              matchFilter === "high"
                ? "bg-surface text-accent shadow-sm border border-border/50"
                : "text-text-secondary hover:text-text-primary border border-transparent"
            }`}
          >
            High Match
          </button>
          <button
            type="button"
            onClick={() => setMatchFilter("low")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              matchFilter === "low"
                ? "bg-surface text-accent shadow-sm border border-border/50"
                : "text-text-secondary hover:text-text-primary border border-transparent"
            }`}
          >
            Low Match
          </button>
        </div>

        {/* Sort by dropdown */}
        <div className="relative flex-grow sm:flex-grow-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={selectClasses}
          >
            <option value="score">Match Score</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
