"use client";

import { Send } from "lucide-react";

type Props = {
  applyUrl: string | null;
  sourceUrl: string | null;
};

export function JobActions({ applyUrl, sourceUrl }: Props) {
  const targetUrl = applyUrl || sourceUrl;

  if (!targetUrl) return null;

  return (
    <div className="pt-2">
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-accent hover:bg-accent-dark text-accent-foreground font-bold py-4 rounded-xl text-center shadow-sm text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 hover:shadow hover:scale-[1.01]"
      >
        <Send className="h-4.5 w-4.5" />
        <span>Apply Now</span>
      </a>
    </div>
  );
}
