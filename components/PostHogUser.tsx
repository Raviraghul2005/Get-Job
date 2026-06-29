"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

interface Props {
  userId: string;
  email: string;
  name?: string | null;
}

export function PostHogIdentify({ userId, email, name }: Props) {
  useEffect(() => {
    posthog.identify(userId, { email, name: name ?? undefined });
  }, [userId, email, name]);
  return null;
}
