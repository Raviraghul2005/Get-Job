"use client";

import { signOut } from "@/actions/auth";
import { useState } from "react";
import posthog from "posthog-js";

export function SignOutButton() {
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    posthog.capture("user_signed_out");
    posthog.reset();
    await signOut();
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="inline-flex items-center justify-center border border-border bg-surface hover:bg-surface-secondary text-text-dark text-sm font-medium rounded-md px-3 py-1.5 transition-colors disabled:opacity-60"
    >
      {loading ? (
        <div className="h-4 w-4 border-2 border-text-muted border-t-accent rounded-full animate-spin" />
      ) : (
        "Sign out"
      )}
    </button>
  );
}
