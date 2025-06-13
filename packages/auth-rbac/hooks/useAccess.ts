import useSWR from "swr";

interface AccessResponse {
  can: boolean;
  reason?: string;
}

export function useAccess({
  resource,
  action,
  record,
  field,
}: {
  resource: string;
  action: string;
  record?: Record<string, unknown>;
  field?: string;
}) {
  const key = `/api/access?resource=${resource}&action=${action}${field ? `&field=${field}` : ""}`;
  const { data, error } = useSWR<AccessResponse>(key);

  return {
    can: data?.can ?? false,
    reason: data?.reason ?? (error ? "Unknown error" : undefined),
    loading: !data && !error,
  };
}