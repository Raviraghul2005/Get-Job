"use client";

import { useState } from "react";
import { Search, Building, AlertCircle, RefreshCw, CheckCircle, ExternalLink, HelpCircle } from "lucide-react";

type ResearchDossier = {
  companyOverview?: string;
  techStack?: string[];
  culture?: string[];
  whyThisRole?: string;
  yourEdge?: string[];
  gapsToAddress?: string[];
  smartQuestions?: string[];
  interviewPrep?: string[];
  sources?: string[];
};

type Props = {
  jobId: string;
  companyName: string;
  researchData: ResearchDossier | null;
};

export function CompanyResearch({ jobId, companyName, researchData }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleResearch = async () => {
    setIsLoading(true);
    setNotice(null);

    try {
      // Attempt to hit the future research endpoint
      const response = await fetch("/api/agent/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      if (response.status === 404) {
        // Fallback for Phase 12 where Phase 13 agent endpoint is not yet implemented
        setTimeout(() => {
          setIsLoading(false);
          setNotice(
            "The Company Research Agent will be fully operational in Feature 13! We will wire the browser automation and AI dossier synthesis in the next phase."
          );
        }, 1500);
        return;
      }

      const result = await response.json();
      if (!response.ok || !result.success) {
        setNotice(result.error || "Failed to trigger company research. Agent is offline.");
      } else {
        // Successful trigger - reload page to fetch newly generated data
        window.location.reload();
      }
    } catch {
      setNotice(
        "The Company Research Agent will be fully operational in Feature 13! We will wire the browser automation and AI dossier synthesis in the next phase."
      );
    } finally {
      if (!isLoading) {
        setIsLoading(false);
      }
    }
  };

  const hasData = researchData && Object.keys(researchData).length > 0;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border pb-4 gap-4">
        <div className="flex items-center gap-2">
          <div className="text-text-secondary p-1 bg-surface-secondary border border-border rounded-lg flex items-center justify-center">
            <Building className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-text-primary">
            Company Research
          </h2>
        </div>

        {!hasData && (
          <button
            onClick={handleResearch}
            disabled={isLoading}
            className="bg-accent hover:bg-accent-dark text-accent-foreground rounded-xl px-4 py-2 text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span>{isLoading ? "Researching..." : "Research Company"}</span>
          </button>
        )}
      </div>

      {/* Notice Banner */}
      {notice && (
        <div className="bg-accent-muted border border-accent-light text-accent rounded-xl p-4 flex items-start gap-2.5 text-sm font-medium animate-fade-in">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{notice}</span>
        </div>
      )}

      {/* Content Area */}
      {hasData ? (
        <div className="space-y-6">
          {/* Company Overview */}
          {researchData.companyOverview && (
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                Company Overview
              </h3>
              <p className="text-sm text-text-primary leading-relaxed">
                {researchData.companyOverview}
              </p>
            </div>
          )}

          {/* Tech Stack Tags */}
          {researchData.techStack && researchData.techStack.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {researchData.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="bg-surface-secondary border border-border text-text-dark text-xs px-2.5 py-1 rounded-md font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Culture */}
          {researchData.culture && researchData.culture.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                Culture & Values
              </h3>
              <ul className="space-y-2">
                {researchData.culture.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-text-primary leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Why This Role */}
          {researchData.whyThisRole && (
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                Why This Role Exists
              </h3>
              <p className="text-sm text-text-primary leading-relaxed">
                {researchData.whyThisRole}
              </p>
            </div>
          )}

          {/* Your Edge (Highlight Container) */}
          {researchData.yourEdge && researchData.yourEdge.length > 0 && (
            <div className="bg-success-lightest border border-success-light/60 rounded-xl p-4 space-y-2.5">
              <h3 className="text-[11px] font-bold text-success-foreground uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" />
                Your Edge
              </h3>
              <ul className="space-y-2">
                {researchData.yourEdge.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-success-darker leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-success flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gaps to Address */}
          {researchData.gapsToAddress && researchData.gapsToAddress.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                Gaps to Address (Strategy)
              </h3>
              <ul className="space-y-2">
                {researchData.gapsToAddress.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-text-primary leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-warning flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Smart Questions */}
          {researchData.smartQuestions && researchData.smartQuestions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5" />
                Questions to Ask
              </h3>
              <ul className="space-y-2">
                {researchData.smartQuestions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-text-primary leading-relaxed italic">
                    <span className="mt-2 h-1 w-1 bg-text-secondary rounded-full flex-shrink-0" />
                    <span>"{item}"</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interview Prep */}
          {researchData.interviewPrep && researchData.interviewPrep.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                Interview Preparation
              </h3>
              <ul className="space-y-2">
                {researchData.interviewPrep.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-text-primary leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-info flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sources */}
          {researchData.sources && researchData.sources.length > 0 && (
            <div className="border-t border-border pt-4 text-xs text-text-muted space-y-1">
              <span className="font-semibold text-text-secondary">Sources Researched:</span>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {researchData.sources.map((src, idx) => {
                  const isUrl = src.startsWith("http://") || src.startsWith("https://");
                  if (isUrl) {
                    return (
                      <a
                        key={idx}
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent flex items-center gap-0.5 underline transition-colors"
                      >
                        <span>{src.replace(/^https?:\/\/(www\.)?/, "")}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    );
                  }
                  return (
                    <span
                      key={idx}
                      className="text-text-secondary font-medium bg-surface-secondary px-2 py-0.5 rounded border border-border"
                    >
                      {src}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-surface-secondary border border-border rounded-xl h-12 w-12 flex items-center justify-center p-2.5 mb-3 text-text-muted flex-shrink-0 shadow-xs">
            <Building className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-text-primary mb-1">
            No research yet
          </h3>
          <p className="text-xs text-text-secondary max-w-xs leading-relaxed">
            Click 'Research Company' to let the AI browse {companyName}'s public pages and build a dossier.
          </p>
        </div>
      )}
    </div>
  );
}
