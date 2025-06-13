export type JSONRule = {
  event: string;
  conditions?: Record<string, any>;
  actions: {
    type: "log" | "webhook" | "email";
    [key: string]: any;
  }[];
};

export async function evaluateRule(rule: JSONRule, payload: any) {
  const conditionMet = rule.conditions
    ? Object.entries(rule.conditions).every(([key, value]) => {
        const keys = key.split(".");
        const data = keys.reduce((acc, k) => acc?.[k], payload);
        return data === value;
      })
    : true;

  if (!conditionMet) return { skipped: true };

  for (const action of rule.actions) {
    switch (action.type) {
      case "log":
        console.log("[RuleEngine LOG]", action.message ?? payload);
        break;
      case "webhook":
        await fetch(action.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        break;
      case "email":
        console.log("[Simulated Email]", action.to, action.template);
        break;
    }
  }

  return { executed: true };
}
