import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { evaluateAccess } from "../engine/evaluate";
import { getUserContext } from "../adapters/clerk";
import { rules } from "../config/rules";

export function withAuthorization(options: { resource: string; action: string; field?: string }) {
  return async (req: NextRequest) => {
    try {
      const context = await getUserContext(req);
      const result = evaluateAccess({
        rules,
        context,
        action: options.action,
        resource: options.resource,
        field: options.field,
      });
      if (!result.can) {
        return NextResponse.json({ error: result.reason }, { status: 403 });
      }
      return NextResponse.next();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unauthorized";
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
  };
}