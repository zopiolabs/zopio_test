export type DSLNode =
  | { equals: [string, string] }
  | { and: DSLNode[] }
  | { or: DSLNode[] };

export function evaluateDsl(rule: DSLNode, context: Record<string, unknown>, record: Record<string, unknown> | null): boolean {
  const get = (path: string) => {
    if (path.startsWith("context.")) return context[path.slice(8)];
    if (path.startsWith("record.")) return record?.[path.slice(7)];
    return undefined;
  };

  if ("equals" in rule) {
    const [a, b] = rule.equals;
    return get(a) === get(b);
  }
  if ("and" in rule) return rule.and.every(r => evaluateDsl(r, context, record));
  if ("or" in rule) return rule.or.some(r => evaluateDsl(r, context, record));
  return false;
}
