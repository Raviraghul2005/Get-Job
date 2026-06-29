"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import posthog from "posthog-js";

export function Hero() {
  return (
    <section className="w-full bg-transparent px-4 sm:px-6 md:px-8 pt-8 pb-4">
      <div className="max-w-[1400px] mx-auto relative overflow-hidden bg-surface border border-border rounded-2xl shadow-sm px-6 py-16 md:py-24 text-center flex flex-col items-center">
        {/* Background glow effects inside the card container (z-0 to render above the card background but behind the content) */}
        <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[70%] rounded-full bg-[#61A8FF]/15 blur-[130px] pointer-events-none z-0" />
        <div className="absolute top-[-10%] right-[-15%] w-[60%] h-[70%] rounded-full bg-[#7C5CFC]/15 blur-[130px] pointer-events-none z-0" />
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[70%] h-[50%] bg-[#F3E8FF]/30 blur-[120px] pointer-events-none z-0" />

        {/* Content wrapped in relative z-10 */}
        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Main Headings */}
          <h1 className="text-4xl sm:text-5xl md:text-[64px] font-bold text-text-primary tracking-tight leading-[1.1] max-w-4xl">
            Job hunting is hard. <br />
            <span className="text-text-primary">Your tools shouldn&apos;t be.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-text-secondary max-w-[640px] leading-relaxed">
            Stop applying blind. JobPilot finds the jobs, researches the companies, and
            gives you everything you need to stand out.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/login"
              onClick={() => posthog.capture("get_started_clicked", { location: "hero" })}
              className="inline-flex items-center justify-center gap-2 bg-text-darkest hover:bg-overlay-dark text-white text-sm font-medium rounded-md px-6 py-3 transition-colors w-full sm:w-auto"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/find-jobs"
              onClick={() => posthog.capture("find_first_match_clicked", { location: "hero" })}
              className="inline-flex items-center justify-center bg-surface border border-border text-text-primary hover:bg-surface-secondary text-sm font-medium rounded-md px-6 py-3 transition-colors w-full sm:w-auto shadow-sm"
            >
              Find Your First Match
            </Link>
          </div>

          {/* Dashboard Preview Demo */}
          <div className="mt-16 md:mt-20 w-full max-w-[1000px] relative px-2 md:px-0">
            {/* Glassmorphic border and shadow wrapper */}
            <div className="relative rounded-2xl overflow-hidden border border-border/80 shadow-2xl bg-surface">
              {/* Browser frame decoration */}
              <div className="w-full h-10 border-b border-border bg-surface-secondary px-4 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <div className="flex-1 max-w-md mx-auto h-6 rounded-md bg-surface border border-border/60 flex items-center justify-center text-[10px] sm:text-xs text-text-muted select-none">
                  🔒 jobpilot.ai/dashboard
                </div>
                <div className="w-12" /> {/* spacer to balance browser dots */}
              </div>

              {/* Dashboard Demo Image */}
              <div className="relative w-full aspect-[4788/2416] bg-surface">
                <Image
                  src="/images/dashboard-demo.png"
                  alt="JobPilot Dashboard Overview"
                  fill
                  priority
                  sizes="(max-width: 1000px) 100vw, 1000px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
