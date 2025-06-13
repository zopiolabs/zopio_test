import { consoleLogger } from "./adapters/console";
import { fileLogger } from "./adapters/file";
import { createBetterStackLogger } from "./adapters/betterstack";

export function getActiveLogger() {
  const target = process.env.AUTH_LOG_TARGET;
  
  if (target === "file") return fileLogger;
  
  if (target === "betterstack") {
    const sourceToken = process.env.BETTERSTACK_SOURCE_TOKEN;
    if (!sourceToken) {
      console.warn("[AUTH-LOG] BETTERSTACK_SOURCE_TOKEN is not set, falling back to console logger");
      return consoleLogger;
    }
    return createBetterStackLogger({ sourceToken });
  }
  
  return consoleLogger;
}