"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, X } from "lucide-react";

interface ProfileBannerProps {
  percentage: number;
}

export function ProfileBanner({ percentage }: ProfileBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || percentage >= 100) {
    return null;
  }

  return (
    <div className="relative bg-accent-muted border border-accent-light rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm animate-fade-in mb-6">
      <div className="flex gap-3.5 items-start">
        <div className="bg-white border border-accent-light rounded-xl p-2.5 flex items-center justify-center text-accent shadow-xs shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-text-primary">
            Complete your profile to unlock full potential
          </h3>
          <p className="text-xs text-text-secondary mt-1 max-w-xl leading-relaxed">
            Your profile is currently <span className="font-semibold text-accent">{percentage}%</span> complete. 
            Completing your profile with skills, work history, and a resume will allow the AI matching engine to accurately score and discover tailored jobs for you.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto self-end md:self-center shrink-0">
        <Link
          href="/profile"
          className="inline-flex items-center justify-center gap-1.5 bg-accent hover:bg-accent-dark text-accent-foreground text-xs font-semibold rounded-md px-4 py-2.5 transition-colors shadow-xs h-9 w-full md:w-auto"
        >
          Go to Profile
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-white/50 transition-colors hidden md:block"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
