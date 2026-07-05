"use client";

import { useState } from "react";
import { FileText, CheckCircle2, ExternalLink } from "lucide-react";

type Props = {
  aboutRole: string | null;
  responsibilities: string[] | null;
  requirements: string[] | null;
  niceToHave: string[] | null;
  benefits: string[] | null;
  sourceUrl?: string | null;
};

export function JobDescription({
  aboutRole,
  responsibilities,
  requirements,
  niceToHave,
  benefits,
  sourceUrl,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const CHAR_LIMIT = 300;

  const endsWithEllipsis = aboutRole
    ? aboutRole.trim().endsWith("...") || aboutRole.trim().endsWith("…")
    : false;

  const shouldTruncate = aboutRole && aboutRole.length > CHAR_LIMIT && !endsWithEllipsis;
  const displayText = shouldTruncate && !isExpanded
    ? aboutRole.slice(0, CHAR_LIMIT).trim() + "..."
    : aboutRole;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <div className="text-text-secondary p-1 bg-surface-secondary border border-border rounded-lg flex items-center justify-center">
          <FileText className="h-5 w-5" />
        </div>
        <h2 className="text-base font-bold text-text-primary">
          Job Description
        </h2>
      </div>

      {/* About the Role */}
      {aboutRole && (
        <div className="space-y-2 flex flex-col items-start w-full">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider text-[11px] text-text-secondary">
            About The Role
          </h3>
          <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line w-full">
            {displayText}
          </p>
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-semibold text-accent hover:text-accent-dark transition-colors mt-1 focus:outline-none cursor-pointer"
            >
              {isExpanded ? "Show Less" : "Read Full Description"}
            </button>
          )}
          {endsWithEllipsis && sourceUrl && (
            <div className="mt-3 text-xs text-text-secondary bg-surface-secondary border border-border/80 rounded-xl p-3 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <span>This description is a preview snippet from the search listing.</span>
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-dark font-semibold inline-flex items-center gap-1 shrink-0"
              >
                <span>View Full Listing</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Responsibilities */}
      {responsibilities && responsibilities.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider text-[11px] text-text-secondary">
            Key Responsibilities
          </h3>
          <ul className="space-y-2">
            {responsibilities.map((resp, index) => (
              <li key={index} className="flex items-start gap-2.5 text-sm text-text-primary leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Requirements */}
      {requirements && requirements.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider text-[11px] text-text-secondary">
            Requirements & Qualifications
          </h3>
          <ul className="space-y-2">
            {requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2.5 text-sm text-text-primary leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Nice to Have */}
      {niceToHave && niceToHave.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider text-[11px] text-text-secondary">
            Nice To Have
          </h3>
          <ul className="space-y-2">
            {niceToHave.map((nth, index) => (
              <li key={index} className="flex items-start gap-2.5 text-sm text-text-primary leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-info flex-shrink-0" />
                <span>{nth}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Benefits */}
      {benefits && benefits.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider text-[11px] text-text-secondary">
            Benefits & Perks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 text-sm text-text-primary bg-surface-secondary border border-border/60 rounded-xl px-4 py-3 shadow-xs"
              >
                <CheckCircle2 className="h-4.5 w-4.5 text-success flex-shrink-0" />
                <span className="font-medium text-text-dark">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
