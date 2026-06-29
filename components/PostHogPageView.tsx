"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

interface Props {
  eventName: string;
  properties?: Record<string, any>;
}

export function PostHogPageView({ eventName, properties }: Props) {
  useEffect(() => {
    posthog.capture(eventName, properties);
  }, [eventName, properties]);
  return null;
}
