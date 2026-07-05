import { Search, MapPin, Sparkles, AlertCircle } from "lucide-react";

type SuccessData = {
  jobsFound: number;
  strongMatches: number;
};

interface SearchControlsProps {
  jobTitle: string;
  location: string;
  setJobTitle: (val: string) => void;
  setLocation: (val: string) => void;
  onSearch: () => void;
  isSearching: boolean;
  successData: SuccessData | null;
  errorMessage: string | null;
}

export function SearchControls({
  jobTitle,
  location,
  setJobTitle,
  setLocation,
  onSearch,
  isSearching,
  successData,
  errorMessage,
}: SearchControlsProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-4 items-end">
        {/* Job Title Input */}
        <div className="flex-grow w-full">
          <label
            htmlFor="job-title"
            className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5"
          >
            Job Title
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-text-muted" />
            </span>
            <input
              id="job-title"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Frontend Engineer"
              className="bg-surface border border-border rounded-md pl-10 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent w-full outline-none"
            />
          </div>
        </div>

        {/* Location Input */}
        <div className="flex-grow w-full">
          <label
            htmlFor="location"
            className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5"
          >
            Location
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-text-muted" />
            </span>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Remote, New York..."
              className="bg-surface border border-border rounded-md pl-10 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent w-full outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSearching}
          className="w-full lg:w-auto bg-accent text-accent-foreground hover:bg-accent-dark rounded-md px-5 py-2 text-sm font-medium transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer h-[38px] flex-shrink-0 whitespace-nowrap"
        >
          <Search className="h-4 w-4" />
          {isSearching ? "Searching..." : "Find Jobs"}
        </button>
      </form>

      {/* Success Notification Banner */}
      {successData && (
        <div className="bg-success-lightest border border-success-light rounded-xl p-4 flex items-center gap-2 text-success-darker text-sm font-medium animate-fade-in">
          <Sparkles className="h-5 w-5 text-success-darker flex-shrink-0" />
          <span>
            Found {successData.jobsFound} jobs and saved {successData.strongMatches} strong matches.
          </span>
        </div>
      )}

      {/* Error Notification Banner */}
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-2 text-red-400 text-sm font-medium animate-fade-in">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
