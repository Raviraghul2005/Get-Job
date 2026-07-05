import Browserbase from "@browserbasehq/sdk";

export const bb = new Browserbase({
  apiKey: process.env.BROWSERBASE_API_KEY!,
});

export async function createBrowserbaseSession() {
  const projectId = process.env.BROWSERBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error("Missing BROWSERBASE_PROJECT_ID environment variable.");
  }
  return await bb.sessions.create({
    projectId,
    timeout: 120, // 2 minute session
  });
}
