import { SchemaProvider } from "./hooks/useSchemaState";
import { DragDropCanvas } from "./canvas/DragDropCanvas";
import { Toolbox } from "./toolbox/Toolbox";
import { JSONEditor } from "./json-editor/JSONEditor";
import { AIPromptPanel } from "./ai/AIPromptPanel";

export function ViewBuilder() {
  return (
    <SchemaProvider>
      <div className="grid grid-cols-5 gap-4 h-full p-4">
        <div className="col-span-1 space-y-4">
          <Toolbox />
          <AIPromptPanel />
        </div>
        <div className="col-span-3">
          <DragDropCanvas />
        </div>
        <div className="col-span-1">
          <JSONEditor />
        </div>
      </div>
    </SchemaProvider>
  );
}
