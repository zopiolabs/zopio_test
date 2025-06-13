import { PermissionRule } from "@repo/auth-rbac";

export const abacRules: PermissionRule[] = [
  {
    resource: "invoices",
    action: "read",
    condition: (ctx, record) => ctx.region === record.region
  },
  {
    resource: "payments",
    action: "approve",
    condition: (ctx, record) => ctx.clearanceLevel >= 3
  }
];