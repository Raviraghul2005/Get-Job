"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import posthog from "posthog-js";

export function Features() {
  return (
    <div className="w-full bg-transparent flex flex-col gap-4">
      {/* Feature Section 1: Manage Your Job Search With Ease */}
      <section className="w-full bg-transparent px-4 sm:px-6 md:px-8 py-4">
        <div className="max-w-[1400px] mx-auto bg-surface border border-border rounded-2xl shadow-sm px-6 md:px-12 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column: Value Props */}
            <div className="flex flex-col gap-8">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight leading-tight max-w-lg">
                Manage Your Job Search With Ease
              </h2>

              <div className="flex flex-col">
                {/* Item 1 - Active */}
                <div className="border-l-[3px] border-accent pl-6 py-4 bg-accent-muted/40 rounded-r-lg">
                  <h3 className="text-base font-semibold text-text-primary">
                    Find jobs that actually fit
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                    Search by title and location or paste a job link. Get matched roles you can quickly scan.
                  </p>
                </div>

                {/* Item 2 */}
                <div className="border-l-[3px] border-transparent pl-6 py-4 hover:bg-surface-secondary transition-colors rounded-r-lg">
                  <h3 className="text-base font-semibold text-text-primary">
                    Know the Company Before You Apply
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                    Stop guessing what a company is about. JobPilot browses their site and gives you everything you need to apply with confidence.
                  </p>
                </div>

                {/* Item 3 */}
                <div className="border-l-[3px] border-transparent pl-6 py-4 hover:bg-surface-secondary transition-colors rounded-r-lg">
                  <h3 className="text-base font-semibold text-text-primary">
                    Keep track of every application
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                    Keep a clear view of every job you&apos;ve found, tailored. Your activity and progress all stay in one simple place.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Jobs List Image */}
            <div className="relative w-full aspect-[1.4] rounded-xl overflow-hidden border border-border bg-surface">
              <Image
                src="/images/jobs-lists.png"
                alt="Job Pilot Job Listings Table"
                fill
                sizes="(max-width: 1200px) 100vw, 600px"
                className="object-contain p-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2: Apply With More Confidence, Every Time */}
      <section className="w-full bg-transparent px-4 sm:px-6 md:px-8 py-4">
        <div className="max-w-[1400px] mx-auto bg-surface border border-border rounded-2xl shadow-sm px-6 md:px-12 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column: Agent Log Image */}
            <div className="order-2 lg:order-1 relative w-full aspect-[1.4] rounded-xl overflow-hidden border border-border bg-surface">
              <Image
                src="/images/agnet-log.png"
                alt="AI Agent Log Panel"
                fill
                sizes="(max-width: 1200px) 100vw, 600px"
                className="object-contain p-2"
              />
            </div>

            {/* Right Column: Value Props */}
            <div className="order-1 lg:order-2 flex flex-col gap-8">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight leading-tight max-w-lg">
                Apply With More Confidence, Every Time
              </h2>

              <div className="flex flex-col">
                {/* Item 1 */}
                <div className="border-l-[3px] border-transparent pl-6 py-4 hover:bg-surface-secondary transition-colors rounded-r-lg">
                  <h3 className="text-base font-semibold text-text-primary">
                    Understand your match score
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                    See how your profile lines up with each role before you apply. Get a clear breakdown of what fits and what&apos;s missing.
                  </p>
                </div>

                {/* Item 2 */}
                <div className="border-l-[3px] border-transparent pl-6 py-4 hover:bg-surface-secondary transition-colors rounded-r-lg">
                  <h3 className="text-base font-semibold text-text-primary">
                    AI-Powered Job Matching
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                    Stop guessing which jobs are worth applying to. JobPilot scores every role against your actual skills so you focus on the ones that matter.
                  </p>
                </div>

                {/* Item 3 */}
                <div className="border-l-[3px] border-transparent pl-6 py-4 hover:bg-surface-secondary transition-colors rounded-r-lg">
                  <h3 className="text-base font-semibold text-text-primary">
                    Focus on the right roles
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                    Filter out low fit jobs and stay on the ones that actually matter. Spend less time sorting and more time applying.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="w-full bg-transparent px-4 sm:px-6 md:px-8 py-4">
        <div className="max-w-[1400px] mx-auto bg-surface border border-border rounded-2xl shadow-sm px-6 py-16 md:py-20 flex flex-col items-center gap-6">
          <span className="text-xs font-semibold text-info-dark tracking-widest uppercase">
            Success Stories
          </span>
          <blockquote className="text-xl sm:text-2xl md:text-[28px] font-medium text-text-primary leading-relaxed tracking-tight max-w-4xl text-center">
            “I used to spend my evenings copy-pasting resumes. Now I open my dashboard to see interviews waiting. It feels like cheating. Had 3 offers on the table simultaneously.”
          </blockquote>
          
          <div className="flex items-center gap-3 mt-4">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-border">
              <Image
                src="/images/user-icon.png"
                alt="Tom Wilson"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-text-primary leading-tight">Tom Wilson</p>
              <p className="text-xs text-text-secondary mt-0.5">Junior Developer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Call to Action Section */}
      <section className="w-full bg-transparent px-4 sm:px-6 md:px-8 pt-4 pb-8">
        <div className="max-w-[1400px] mx-auto relative overflow-hidden bg-surface border border-border rounded-2xl shadow-sm px-6 py-16 md:py-24 text-center flex flex-col items-center">
          {/* Background glow effects inside the card container (z-0 to render above the card background but behind the content) */}
          <div className="absolute bottom-[-20%] left-[-15%] w-[60%] h-[80%] rounded-full bg-[#61A8FF]/15 blur-[130px] pointer-events-none z-0" />
          <div className="absolute bottom-[-20%] right-[-15%] w-[60%] h-[80%] rounded-full bg-[#7C5CFC]/15 blur-[130px] pointer-events-none z-0" />
          <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[70%] h-[60%] bg-[#F3E8FF]/30 blur-[120px] pointer-events-none z-0" />

          {/* Content wrapped in relative z-10 */}
          <div className="relative z-10 w-full flex flex-col items-center">
            <h2 className="text-3xl md:text-[40px] font-bold text-text-primary tracking-tight leading-tight max-w-2xl">
              Your next job search can feel a lot less overwhelming
            </h2>
            <p className="mt-4 text-sm sm:text-base text-text-secondary max-w-[540px]">
              Set up your profile, upload your resume, and start finding matches in minutes.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/login"
                onClick={() => posthog.capture("cta_clicked", { label: "get_started", location: "features_bottom" })}
                className="inline-flex items-center justify-center gap-2 bg-text-darkest hover:bg-overlay-dark text-white text-sm font-medium rounded-md px-6 py-3 transition-colors w-full sm:w-auto"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/find-jobs"
                onClick={() => posthog.capture("cta_clicked", { label: "find_first_match", location: "features_bottom" })}
                className="inline-flex items-center justify-center bg-surface border border-border text-text-primary hover:bg-surface-secondary text-sm font-medium rounded-md px-6 py-3 transition-colors w-full sm:w-auto shadow-sm"
              >
                Find Your First Match
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
