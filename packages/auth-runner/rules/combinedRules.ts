import { rules as rbacRules } from "@repo/auth-rbac";
import { abacRules } from "@repo/auth-abac";

export const combinedRules = [...rbacRules, ...abacRules];