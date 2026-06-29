"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { insforge } from "@/lib/insforge-client";
import { getOAuthUrl } from "@/actions/auth";
import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const error = searchParams.get("error");

  // Redirect away if already authenticated
  useEffect(() => {
    async function checkAuth() {
      const { data } = await insforge.auth.getCurrentUser();
      if (data?.user) {
        router.replace("/profile");
      }
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (error) {
      posthog.capture("oauth_error_displayed", { error });
    }
  }, [error]);

  async function handleOAuth(provider: "google" | "github") {
    setLoadingProvider(provider);
    posthog.capture("oauth_initiated", { provider });
    try {
      const url = await getOAuthUrl(provider, `${window.location.origin}/api/auth/callback`);
      window.location.href = url;
    } catch (err) {
      console.error("OAuth error:", err);
      posthog.captureException(err);
      setLoadingProvider(null);
    }
  }

  return (
    <div className="min-h-screen bg-background bg-stripes flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative glows behind the main split card container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#61A8FF]/10 blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] rounded-full bg-[#7C5CFC]/10 blur-[130px] pointer-events-none z-0" />

      {/* Main Split-Screen Container Card */}
      <div className="relative z-10 w-full max-w-[1080px] min-h-[640px] bg-surface border border-border/80 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side Pane: App Teaser Visual (Hidden on mobile) */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-surface-secondary border-r border-border flex-col justify-between p-10 overflow-hidden">
          {/* Inner panel ambient glows */}
          <div className="absolute -top-20 -left-20 w-[250px] h-[250px] rounded-full bg-[#61A8FF]/10 blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-[250px] h-[250px] rounded-full bg-[#7C5CFC]/10 blur-[90px] pointer-events-none" />

          {/* Logo link */}
          <div className="relative z-10">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <Image
                src="/images/logo.png"
                alt="JobPilot"
                width={120}
                height={40}
                className="h-8.5 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* 3D Floating Mockups Visual */}
          <div className="relative z-10 my-8 flex items-center justify-center">
            <div className="relative w-full max-w-[320px] aspect-[4/3] rounded-xl overflow-hidden border border-border/70 shadow-lg bg-surface">
              <Image
                src="/images/jobs-lists.png"
                alt="Matched jobs list"
                fill
                sizes="320px"
                className="object-cover object-top opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-secondary/40 to-transparent" />
              
              {/* Floating Match Card Overlay */}
              <div className="absolute -bottom-4 -left-4 bg-surface border border-border rounded-xl p-4 shadow-xl max-w-[200px] z-20 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-accent bg-accent-light px-2 py-0.5 rounded-full">
                    94% Match
                  </span>
                </div>
                <h4 className="text-xs font-bold text-text-primary truncate">Staff React Engineer</h4>
                <p className="text-[10px] text-text-secondary mt-0.5">Stripe • Remote</p>
              </div>

              {/* Floating Research Badge Overlay */}
              <div className="absolute -top-3 -right-3 bg-surface border border-border rounded-xl px-3 py-1.5 shadow-md z-20 flex items-center gap-1.5 transform rotate-3">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[9px] font-bold text-text-dark">Company Researched</span>
              </div>
            </div>
          </div>

          {/* Feature quote & Pagination-like dots */}
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-text-primary tracking-tight">
              Find matches, not listings.
            </h3>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed max-w-[280px]">
              Let AI co-pilot your profile optimization, company research, and applications.
            </p>
            
            {/* Dots to mimic screen slider framing */}
            <div className="flex gap-1.5 mt-5">
              <span className="w-5 h-1.5 rounded-full bg-accent transition-all duration-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-border-muted" />
              <span className="w-1.5 h-1.5 rounded-full bg-border-muted" />
            </div>
          </div>
        </div>

        {/* Right Side Pane: Actual Signup/Login Form */}
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-center items-center p-8 sm:p-12 relative z-10 bg-surface">
          {/* Small logo for mobile views */}
          <div className="lg:hidden mb-8">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="JobPilot"
                width={130}
                height={44}
                className="h-9 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Form wrapper */}
          <div className="w-full max-w-[380px] flex flex-col">
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                Create your account
              </h2>
              <p className="text-sm text-text-secondary mt-2">
                Join JobPilot to automate your job application cycle.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3.5 bg-red-50/80 border border-red-200/60 rounded-xl">
                <p className="text-sm text-error text-center font-medium">
                  Authentication failed. Please try again.
                </p>
              </div>
            )}

            {/* OAuth Sign Up buttons */}
            <div className="flex flex-col gap-3.5">
              <button
                onClick={() => handleOAuth("google")}
                disabled={loadingProvider !== null}
                className="w-full flex items-center justify-center gap-3 bg-surface border border-border hover:border-border-muted hover:bg-surface-secondary text-sm font-semibold text-text-primary rounded-xl px-5 py-3.5 shadow-sm hover:shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer h-12"
              >
                {loadingProvider === "google" ? (
                  <div className="h-5 w-5 border-2 border-text-muted border-t-accent rounded-full animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                Continue with Google
              </button>

              <button
                onClick={() => handleOAuth("github")}
                disabled={loadingProvider !== null}
                className="w-full flex items-center justify-center gap-3 bg-text-darkest hover:bg-overlay-dark text-sm font-semibold text-white rounded-xl px-5 py-3.5 shadow-sm hover:shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer h-12"
              >
                {loadingProvider === "github" ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <GitHubIcon />
                )}
                Continue with GitHub
              </button>
            </div>

            {/* Policy & Terms Agreement */}
            <p className="mt-8 text-xs text-text-muted text-center lg:text-left leading-relaxed">
              By signing up, you agree to our{" "}
              <a href="#" className="underline hover:text-accent transition-colors font-medium">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="underline hover:text-accent transition-colors font-medium">Privacy Policy</a>.
            </p>

            {/* Back Link */}
            <div className="mt-8 pt-6 border-t border-border flex justify-center lg:justify-start">
              <Link
                href="/"
                className="text-sm font-semibold text-text-secondary hover:text-accent transition-colors flex items-center gap-1.5"
              >
                ← Back to homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
