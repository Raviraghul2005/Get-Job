"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchControls } from "./SearchControls";
import { JobsFilterBar } from "./JobsFilterBar";
import { JobsTable, Job } from "./JobsTable";

interface FindJobsContainerProps {
  initialJobs: Job[];
}

export function FindJobsContainer({ initialJobs }: FindJobsContainerProps) {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  // Sync state with database-fetched jobs passed down from the Server Component page
  useEffect(() => {
    setJobs(initialJobs);
  }, [initialJobs]);

  // Input fields state
  const [jobTitleInput, setJobTitleInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  // Search state
  const [isSearching, setIsSearching] = useState(false);
  const [successData, setSuccessData] = useState<{ jobsFound: number; strongMatches: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active search query filters
  const [activeJobTitle, setActiveJobTitle] = useState("");

  // List filter and sorting states
  const [textFilter, setTextFilter] = useState("");
  const [matchFilter, setMatchFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 20;

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [textFilter, matchFilter, sortBy, activeJobTitle]);

  const handleSearchSubmit = async () => {
    if (!jobTitleInput.trim()) return;

    setIsSearching(true);
    setSuccessData(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/agent/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: jobTitleInput.trim(),
          location: locationInput.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setErrorMessage(result.error || "Job search failed. Please try again.");
      } else {
        setSuccessData(result.data);
        setActiveJobTitle(jobTitleInput);
        router.refresh();
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Filter & Sort logic
  const processedJobs = useMemo(() => {
    let result = [...jobs];

    // 1. Filter by instant "Filter by company or role..." text input
    if (textFilter.trim()) {
      const textLower = textFilter.toLowerCase();
      result = result.filter(
        (job) =>
          job.company.toLowerCase().includes(textLower) ||
          job.role.toLowerCase().includes(textLower)
      );
    }

    // 2. Filter by Match Score category (High >= 70, Low < 70)
    if (matchFilter === "high") {
      result = result.filter((job) => job.matchScore >= 70);
    } else if (matchFilter === "low") {
      result = result.filter((job) => job.matchScore < 70);
    }

    // 3. Sort Jobs
    result.sort((a, b) => {
      if (sortBy === "score") {
        return b.matchScore - a.matchScore; // Highest score first
      }
      if (sortBy === "newest") {
        return b.dateFound.getTime() - a.dateFound.getTime(); // Newest first
      }
      if (sortBy === "oldest") {
        return a.dateFound.getTime() - b.dateFound.getTime(); // Oldest first
      }
      return 0;
    });

    return result;
  }, [jobs, textFilter, matchFilter, sortBy]);

  // Paginated slice
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * jobsPerPage;
    return processedJobs.slice(start, start + jobsPerPage);
  }, [processedJobs, currentPage, jobsPerPage]);

  return (
    <div className="space-y-6">
      {/* Search Controls Card */}
      <SearchControls
        jobTitle={jobTitleInput}
        location={locationInput}
        setJobTitle={setJobTitleInput}
        setLocation={setLocationInput}
        onSearch={handleSearchSubmit}
        isSearching={isSearching}
        successData={successData}
        errorMessage={errorMessage}
      />

      {/* Filter and Sort Bar */}
      <JobsFilterBar
        textFilter={textFilter}
        setTextFilter={setTextFilter}
        matchFilter={matchFilter}
        setMatchFilter={setMatchFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Jobs Results Table */}
      <JobsTable
        jobs={paginatedJobs}
        totalResults={processedJobs.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        jobsPerPage={jobsPerPage}
      />
    </div>
  );
}
