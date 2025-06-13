import type {
  AccessEvaluationInput,
  AccessEvaluationResult,
} from "../types";

import { evaluateDsl } from "./evaluateDsl";

export function evaluateAccess({
  rules,
  context,
  action,
  resource,
  record,
  field,
}: AccessEvaluationInput): AccessEvaluationResult {
  for (const rule of rules) {
    if (rule.resource === resource && rule.action === action) {
      const conditionOk = rule.condition
        ? rule.condition(context, record)
        : rule.dsl
          ? evaluateDsl(rule.dsl, context, record || null)
          : true;
      if (!conditionOk) continue;
      if (field && rule.fieldPermissions) {
        const accessLevel = rule.fieldPermissions[field];
        if (!accessLevel || accessLevel === "none") {
          return { can: false, reason: `No access to field '${field}'` };
        }
      }
      return { can: true };
    }
  }
  return { can: false, reason: "No matching rule found" };
}