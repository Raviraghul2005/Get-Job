"use client";

import { Sparkles, Check, X } from "lucide-react";

type Props = {
  matchReason: string;
  matchedSkills: string[];
  missingSkills: string[];
};

export function MatchScore({ matchReason, matchedSkills, missingSkills }: Props) {
  return (
    <div className="space-y-6">
      {/* AI Match Reasoning Card */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-success p-1 bg-success-lightest rounded-lg flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-bold text-text-secondary tracking-wider uppercase">
            AI Match Reasoning
          </span>
        </div>
        <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
          {matchReason}
        </p>
      </div>

      {/* Required Skills vs Profile Card */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <h2 className="text-[11px] font-bold text-text-secondary tracking-wider uppercase mb-5">
          Required Skills vs Your Profile
        </h2>

        <div className="space-y-5">
          {/* Matched Skills */}
          <div>
            <span className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              You Have ({matchedSkills.length})
            </span>
            {matchedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-success-lightest text-success-foreground text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold border border-success-light shadow-sm transition-all hover:scale-[1.02]"
                  >
                    <Check className="h-3.5 w-3.5 text-success" />
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted italic">
                No matching skills found in your profile.
              </p>
            )}
          </div>

          {/* Gap Skills */}
          <div>
            <span className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Gap Skills ({missingSkills.length})
            </span>
            {missingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-accent-muted text-accent text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold border border-accent-light/50 shadow-sm transition-all hover:scale-[1.02]"
                  >
                    <X className="h-3.5 w-3.5 text-accent" />
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-success font-semibold italic flex items-center gap-1">
                <Check className="h-3.5 w-3.5" />
                No gaps identified! You have all matched skills.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
