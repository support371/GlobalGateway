import type { IncomingMessage, ServerResponse } from "http";
import { createApp } from "../server/app";

// Cache the Express app across warm invocations
let appCache: Awaited<ReturnType<typeof createApp>> | null = null;

async function getApp() {
  if (!appCache) {
    appCache = await createApp();
  }
  return appCache;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const app = await getApp();
  app(req, res);
}
