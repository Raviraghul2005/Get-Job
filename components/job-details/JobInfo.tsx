"use client";

import { Building2, ExternalLink, DollarSign, MapPin, Briefcase, Calendar } from "lucide-react";

type Props = {
  title: string;
  company: string;
  matchScore: number;
  sourceUrl: string;
  salary: string | null;
  location: string;
  jobType: string | null;
  foundAt: Date;
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

export function JobInfo({
  title,
  company,
  matchScore,
  sourceUrl,
  salary,
  location,
  jobType,
  foundAt,
}: Props) {
  // Determine score badge classes based on threshold
  const getScoreBadgeStyles = (score: number) => {
    if (score >= 70) {
      return "bg-success-lightest text-success-foreground border border-success-light";
    }
    return "bg-surface-secondary text-text-secondary border border-border";
  };

  const getJobTypeLabel = (type: string | null) => {
    if (!type) return "Full-time";
    if (type === "fulltime") return "Full-time";
    if (type === "parttime") return "Part-time";
    if (type === "contract") return "Contract";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          {/* Logo Placeholder */}
          <div className="bg-surface-secondary border border-border rounded-xl h-16 w-16 flex items-center justify-center flex-shrink-0">
            <Building2 className="h-8 w-8 text-text-secondary" />
          </div>

          {/* Job details */}
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-bold text-text-primary leading-tight">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary font-medium">
              <span>{company}</span>
              <span className="text-text-muted">•</span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getScoreBadgeStyles(matchScore)}`}>
                {matchScore}% Match
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto border border-border bg-surface hover:bg-surface-secondary text-text-dark rounded-xl px-4 py-2 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <span>View Job Post</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* Key Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Salary */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex items-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-success-lightest text-success mr-4 flex-shrink-0">
            <DollarSign className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-text-primary leading-tight line-clamp-2 break-words">
              {salary || "Not specified"}
            </span>
            <span className="text-[10px] font-bold text-text-muted tracking-wider uppercase mt-0.5">
              Salary Est.
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex items-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-info-lightest text-info-foreground mr-4 flex-shrink-0">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-text-primary leading-tight line-clamp-2 break-words">
              {location}
            </span>
            <span className="text-[10px] font-bold text-text-muted tracking-wider uppercase mt-0.5">
              Location
            </span>
          </div>
        </div>

        {/* Job Type */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex items-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent-muted text-accent mr-4 flex-shrink-0">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-text-primary leading-tight line-clamp-2 break-words">
              {getJobTypeLabel(jobType)}
            </span>
            <span className="text-[10px] font-bold text-text-muted tracking-wider uppercase mt-0.5">
              Job Type
            </span>
          </div>
        </div>

        {/* Date Found */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex items-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface-muted text-text-secondary mr-4 flex-shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-text-primary leading-tight line-clamp-2 break-words">
              {formatRelativeDate(foundAt)}
            </span>
            <span className="text-[10px] font-bold text-text-muted tracking-wider uppercase mt-0.5">
              Date Found
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
