import { useSchemaState } from "../hooks/useSchemaState.js";
import { Button } from "@repo/design-system/components/ui/button";
import { useEffect, useState } from "react";

const predefinedFields = [
  { label: "Text", name: "text", type: "string" },
  { label: "Email", name: "email", type: "string" },
  { label: "Number", name: "quantity", type: "number" }
];

export function Toolbox() {
  const { addField, persistView, getViewList, loadView } = useSchemaState();
  const [views, setViews] = useState<string[]>([]);

  useEffect(() => {
    getViewList().then(setViews);
  }, [getViewList]);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Toolbox</h3>
      {predefinedFields.map((field) => (
        <Button
          key={`${field.name}-${field.type}`}
          variant="outline"
          className="w-full justify-start"
          onClick={() =>
            addField({
              name: `${field.name}-${Date.now()}`,
              label: field.label,
              type: field.type,
              required: false
            })
          }
        >
          ➕ {field.label} Field
        </Button>
      ))}
      <Button variant="default" className="w-full mt-4" onClick={persistView}>
        💾 Save View
      </Button>
      <div className="pt-4">
        <h4 className="text-xs font-semibold text-muted-foreground mb-1">Saved Views</h4>
        {views.map(id => (
          <Button
            key={id}
            variant="ghost"
            className="w-full justify-start"
            onClick={() => loadView(id)}
          >
            📂 {id}
          </Button>
        ))}
      </div>
    </div>
  );
}
