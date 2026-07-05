export const MATCH_THRESHOLD = 70;

export function detectCountry(location: string): string {
  const lower = location.toLowerCase();

  if (
    lower.includes("uk") ||
    lower.includes("london") ||
    lower.includes("england") ||
    lower.includes("britain") ||
    lower.includes("manchester") ||
    lower.includes("birmingham")
  ) {
    return "gb";
  }

  if (
    lower.includes("australia") ||
    lower.includes("sydney") ||
    lower.includes("melbourne") ||
    lower.includes("brisbane")
  ) {
    return "au";
  }

  if (
    lower.includes("canada") ||
    lower.includes("toronto") ||
    lower.includes("vancouver") ||
    lower.includes("montreal")
  ) {
    return "ca";
  }

  return "us";
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
