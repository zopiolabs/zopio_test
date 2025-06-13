import { useState, useEffect } from "react";
import { evaluateAccess } from "@repo/auth-runner";

type Params = {
  resource: string;
  action: string;
  field?: string;
  record?: any;
  context: any;
};

type AccessResult = {
  can: boolean;
  reason?: string;
  loading: boolean;
};

export function useAccess(params: Params): AccessResult {
  const [state, setState] = useState<AccessResult>({
    can: false,
    reason: undefined,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    async function checkAccess() {
      setState(prev => ({ ...prev, loading: true }));
      const result = await Promise.resolve(evaluateAccess(params));
      if (mounted) {
        setState({ can: result.can, reason: result.reason, loading: false });
      }
    }

    checkAccess();
    return () => { mounted = false };
  }, [JSON.stringify(params)]);

  return state;
}