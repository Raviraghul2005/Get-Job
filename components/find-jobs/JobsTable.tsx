"use client";

import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";

export interface Job {
  id: string;
  company: string;
  role: string;
  matchScore: number;
  salaryEst: string;
  dateFound: Date;
  source: "search" | "url";
}

interface JobsTableProps {
  jobs: Job[];
  totalResults: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  jobsPerPage: number;
}

export function JobsTable({
  jobs,
  totalResults,
  currentPage,
  setCurrentPage,
  jobsPerPage,
}: JobsTableProps) {
  const router = useRouter();

  // Helper for progress bar colors
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-success";
    if (score >= 80) return "bg-info";
    return "bg-warning";
  };

  // Helper for formatting relative dates
  const formatRelativeDate = (date: Date) => {
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffMins < 1) {
      return "Just now";
    }
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    }
    if (diffDays === 1) {
      return "Yesterday";
    }
    if (diffDays < 7) {
      return `${diffDays} days ago`;
    }
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
    }
    const months = Math.floor(diffDays / 30);
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  };

  // Pagination calculations
  const totalPages = Math.ceil(totalResults / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = Math.min(startIndex + jobsPerPage, totalResults);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Table Container with overflow for horizontal scrolling on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Match Score
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Salary Est.
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Date Found
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <tr
                  key={job.id}
                  onClick={() => router.push(`/find-jobs/${job.id}`)}
                  className="hover:bg-surface-secondary transition-colors group cursor-pointer"
                >
                  {/* Company Column */}
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="bg-surface-secondary border border-border rounded-lg p-1.5 flex items-center justify-center h-9 w-9 flex-shrink-0 group-hover:bg-surface transition-colors">
                      <Building2 className="h-5 w-5 text-text-secondary" />
                    </div>
                    <span className="text-sm font-semibold text-text-primary">
                      {job.company}
                    </span>
                  </td>

                  {/* Role Column */}
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">
                    {job.role}
                  </td>

                  {/* Match Score Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 w-[120px]">
                      {/* Progress Bar Track */}
                      <div className="h-1.5 bg-border-light rounded-full flex-grow overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getScoreColor(
                            job.matchScore
                          )}`}
                          style={{ width: `${job.matchScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-text-primary w-8 text-right">
                        {job.matchScore}%
                      </span>
                    </div>
                  </td>

                  {/* Salary Column */}
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">
                    {job.salaryEst}
                  </td>

                  {/* Date Column */}
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {formatRelativeDate(job.dateFound)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-text-muted text-sm">
                  No jobs found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 0 && (
        <div className="border-t border-border px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-medium text-text-secondary">
            Showing <span className="font-semibold text-text-primary">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-text-primary">{endIndex}</span> of{" "}
            <span className="font-semibold text-text-primary">{totalResults}</span> results
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="border border-border bg-surface hover:bg-surface-secondary text-text-primary px-3 py-1.5 rounded-md text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Previous
            </button>

            {getPageNumbers().map((pageNum, idx) =>
              pageNum === "..." ? (
                <span key={`ellipse-${idx}`} className="px-2 text-text-muted text-xs font-medium">
                  ...
                </span>
              ) : (
                <button
                  key={`page-${pageNum}`}
                  onClick={() => setCurrentPage(pageNum as number)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-accent-light text-accent border border-accent"
                      : "border border-border hover:bg-surface-secondary text-text-primary"
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="border border-border bg-surface hover:bg-surface-secondary text-text-primary px-3 py-1.5 rounded-md text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
