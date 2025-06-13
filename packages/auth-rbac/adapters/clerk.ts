import type { UserContext } from "../types";
import { getAuth } from "@zopio/auth/server";
import type { NextRequest } from "next/server";

export async function getUserContext(req: NextRequest): Promise<UserContext> {
  const auth = getAuth(req);
  if (!auth.userId || !auth.orgId || !auth.sessionClaims?.metadata?.role) {
    throw new Error("Unauthorized or incomplete session");
  }
  return {
    userId: auth.userId,
    role: auth.sessionClaims.metadata.role,
    tenantId: auth.orgId,
  };
}