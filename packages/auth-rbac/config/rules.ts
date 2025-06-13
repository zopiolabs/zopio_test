import { PermissionRule } from "../types";

export const rules: PermissionRule[] = [
  {
    resource: "orders",
    action: "read",
    condition: (ctx, record) => record.tenantId === ctx.tenantId,
    fieldPermissions: {
      id: "read",
      total: "read",
      cost: "none",
    },
  },
  {
    resource: "orders",
    action: "update",
    condition: (ctx, record) => record.createdBy === ctx.userId,
    fieldPermissions: {
      status: "write",
      total: "none",
    },
  },
  {
    resource: "users",
    action: "invite",
    condition: (ctx) => ctx.role === "admin",
  },
];