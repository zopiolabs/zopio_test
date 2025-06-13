import { TriggerClient } from "@trigger.dev/sdk";

// Validate environment variables
if (!process.env.TRIGGER_API_KEY) {
  console.warn('TRIGGER_API_KEY environment variable is not set. Trigger.dev functionality will not work properly.');
}

/**
 * Configured Trigger.dev client for the Zopio application
 * @see https://trigger.dev/docs/documentation/clients/javascript-client
 */
export const client = new TriggerClient({
  id: "zopio-trigger",
  apiKey: process.env.TRIGGER_API_KEY || 'missing-api-key',
  apiUrl: process.env.TRIGGER_API_URL || "https://api.trigger.dev",
});

/**
 * Helper function to safely send events to Trigger.dev
 * @param eventName The name of the event to trigger
 * @param payload The payload to send with the event
 * @returns Result of the event sending operation
 */
export async function sendEvent<T extends Record<string, unknown>>(
  eventName: string,
  payload: T
) {
  try {
    return await client.sendEvent({
      name: eventName,
      payload,
    });
  } catch (error) {
    console.error(`Failed to send event ${eventName}:`, error);
    throw error;
  }
}
