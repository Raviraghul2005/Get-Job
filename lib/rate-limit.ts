import { createInsforgeServer } from "./insforge-server";

export type RateLimitAction = "search" | "research" | "resume";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  error?: string;
}

export const RATE_LIMITS: Record<RateLimitAction, number> = {
  search: 5,
  research: 2,
  resume: 5,
};

/**
 * Checks and increments the daily rate limit for a user in the database.
 * If the user's last_reset_date is not today, the counters will be reset to 0 first.
 * 
 * @param userId - The ID of the user.
 * @param action - The action type being checked ('search', 'research', 'resume').
 * @param customLimit - Optional custom limit to override default.
 * @returns RateLimitResult
 */
export async function checkRateLimit(
  userId: string,
  action: RateLimitAction,
  customLimit?: number
): Promise<RateLimitResult> {
  const limit = customLimit ?? RATE_LIMITS[action];
  const insforge = await createInsforgeServer();

  // 1. Fetch current profile stats
  const { data: profile, error: fetchError } = await insforge.database
    .from("profiles")
    .select("searches_today, researches_today, resumes_today, last_reset_date")
    .eq("id", userId)
    .single();

  if (fetchError || !profile) {
    console.error(`[rate-limit] Error fetching profile stats for ${userId}:`, fetchError);
    return {
      allowed: false,
      remaining: 0,
      limit,
      error: "Could not retrieve user limit details. Please make sure your profile exists.",
    };
  }

  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const lastReset = profile.last_reset_date;

  let searches = profile.searches_today || 0;
  let researches = profile.researches_today || 0;
  let resumes = profile.resumes_today || 0;

  // 2. Perform daily reset check if date has changed
  if (lastReset !== todayStr) {
    searches = 0;
    researches = 0;
    resumes = 0;

    // Reset counters in DB immediately to prevent race conditions
    const { error: resetError } = await insforge.database
      .from("profiles")
      .update({
        searches_today: 0,
        researches_today: 0,
        resumes_today: 0,
        last_reset_date: todayStr,
      })
      .eq("id", userId);

    if (resetError) {
      console.error(`[rate-limit] Error resetting profile limits for ${userId}:`, resetError);
      return {
        allowed: false,
        remaining: 0,
        limit,
        error: "Failed to initialize daily limits.",
      };
    }
  }

  // 3. Determine current count and check if limit exceeded
  let currentCount = 0;
  let columnName = "";

  if (action === "search") {
    currentCount = searches;
    columnName = "searches_today";
  } else if (action === "research") {
    currentCount = researches;
    columnName = "researches_today";
  } else if (action === "resume") {
    currentCount = resumes;
    columnName = "resumes_today";
  }

  if (currentCount >= limit) {
    const actionLabel = action === "search" ? "job search" : action === "research" ? "company research" : "resume action";
    return {
      allowed: false,
      remaining: 0,
      limit,
      error: `Daily limit of ${limit} ${actionLabel}${limit === 1 ? "" : "s"} reached. Please try again tomorrow.`,
    };
  }

  // 4. Increment count in DB
  const { error: updateError } = await insforge.database
    .from("profiles")
    .update({
      [columnName]: currentCount + 1,
    })
    .eq("id", userId);

  if (updateError) {
    console.error(`[rate-limit] Error updating counter for ${userId}:`, updateError);
    return {
      allowed: false,
      remaining: limit - currentCount,
      limit,
      error: "Failed to log API usage. Please try again.",
    };
  }

  return {
    allowed: true,
    remaining: limit - (currentCount + 1),
    limit,
  };
}
