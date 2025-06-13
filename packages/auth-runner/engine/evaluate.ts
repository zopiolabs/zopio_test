import { evaluateAccess as baseEvaluate } from "@zopio/auth-rbac/engine/evaluate";
import { combinedRules } from "../rules/combinedRules";
import { logAccessAttempt } from "@zopio/auth-log";
import type { UserContext } from "@zopio/auth-rbac/types";

export function evaluateAccess(ctx: {
  context: UserContext;
  resource: string;
  action: string;
  record?: Record<string, unknown>;
  field?: string;
}) {
  const result = baseEvaluate({
    rules: combinedRules,
    ...ctx,
  });

  logAccessAttempt({
    ...ctx,
    timestamp: new Date().toISOString(),
    can: result.can,
    reason: result.reason
  });

  return result;
}
