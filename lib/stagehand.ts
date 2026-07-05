import { Stagehand } from "@browserbasehq/stagehand";

export async function createStagehandInstance(sessionId: string) {
  const apiKey = process.env.BROWSERBASE_API_KEY;
  const projectId = process.env.BROWSERBASE_PROJECT_ID;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || !projectId || !geminiApiKey) {
    throw new Error(
      "Missing required environment variables for Stagehand initialization."
    );
  }

  const stagehand = new Stagehand({
    env: "BROWSERBASE",
    apiKey,
    projectId,
    browserbaseSessionID: sessionId,
    model: {
      modelName: "google/gemini-2.5-flash",
      apiKey: geminiApiKey,
    },
    disablePino: true,
  });

  await stagehand.init();
  return stagehand;
}
