import { client } from "@repo/trigger";
import { eventTrigger, type IO } from "@trigger.dev/sdk";
import { evaluateRule, type JSONRule } from "@repo/trigger-rules";
// Import rules and ensure they match the JSONRule type
import rules from "../rules.json";

// Type assertion to ensure rules match JSONRule type
const typedRules = rules as JSONRule[];

// Define types for our job payloads
interface UserCreatedPayload {
  email: string;
  name?: string;
  userId?: string;
}

interface UserDeletedPayload {
  userId: string;
  reason?: string;
}

/**
 * Job to send a welcome email when a user is created
 */
export const sendWelcomeEmailJob = client.defineJob({
  id: "send-welcome-email",
  name: "Send Welcome Email",
  version: "1.0.0",
  trigger: eventTrigger({
    name: "user.created",
  }),
  run: async (payload: UserCreatedPayload, io: IO) => {
    await io.logger.info(`Sending welcome email to ${payload.email}`);
    return { success: true, email: payload.email };
  },
});

/**
 * Job to notify admins when a new user signs up + evaluate matching rules
 */
export const notifyAdminsJob = client.defineJob({
  id: "notify-admins-new-user",
  name: "Notify Admins of New User",
  version: "1.0.0",
  trigger: eventTrigger({
    name: "user.created",
  }),
  run: async (payload: UserCreatedPayload, io: IO) => {
    await io.logger.info(`New user signed up: ${payload.email}`);

    // Evaluate rules for "user.created"
    const matchingRules = typedRules.filter(rule => rule.event === "user.created");

    for (const rule of matchingRules) {
      await evaluateRule(rule, { user: payload });
    }

    return { success: true };
  },
});

/**
 * Job to process user deletion + evaluate matching rules
 */
export const processUserDeletionJob = client.defineJob({
  id: "process-user-deletion",
  name: "Process User Deletion",
  version: "1.0.0",
  trigger: eventTrigger({
    name: "user.deleted",
  }),
  run: async (payload: UserDeletedPayload, io: IO) => {
    await io.logger.info(`User deleted: ${payload.userId}, reason: ${payload.reason || 'Not specified'}`);
    
    // Evaluate rules for "user.deleted"
    const matchingRules = typedRules.filter(rule => rule.event === "user.deleted");
    
    for (const rule of matchingRules) {
      await evaluateRule(rule, { user: payload });
    }
    
    return { success: true };
  }
});
