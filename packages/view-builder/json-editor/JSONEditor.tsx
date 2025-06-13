import { useSchemaState } from "../hooks/useSchemaState.js";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { safeValidateViewSchema } from "@repo/view/engine/validation/schema";
import { Button } from "@repo/design-system/components/ui/button";
import { Card } from "@repo/design-system/components/ui/card";

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("react-monaco-editor"), { ssr: false });

/**
 * JSON Editor component for editing view schemas directly
 */
export function JSONEditor() {
  const { schema, setSchema } = useSchemaState();
  const [jsonValue, setJsonValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  
  // Update JSON value when schema changes
  useEffect(() => {
    setJsonValue(JSON.stringify(schema, null, 2));
    setIsDirty(false);
  }, [schema]);
  
  // Handle JSON changes
  const handleJsonChange = useCallback((value: string) => {
    setJsonValue(value);
    setIsDirty(true);
    
    try {
      // Try to parse the JSON to validate it
      JSON.parse(value || "{}");
      setError(null);
    } catch (err) {
      // Set error message if JSON is invalid
      setError((err as Error).message);
    }
  }, []);
  
  // Apply changes to the schema
  const applyChanges = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonValue || "{}");
      
      // Validate the schema
      const validationResult = safeValidateViewSchema(parsed);
      
      if (validationResult.success) {
        setSchema(parsed);
        setIsDirty(false);
        setError(null);
      } else {
        // Show validation error
        setError(`Schema validation failed: ${validationResult.error?.message || "Invalid schema"}`);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  }, [jsonValue, setSchema]);
  
  // Reset to current schema
  const resetChanges = useCallback(() => {
    setJsonValue(JSON.stringify(schema, null, 2));
    setIsDirty(false);
    setError(null);
  }, [schema]);
  
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="p-3 border-b flex justify-between items-center">
        <h3 className="text-sm font-semibold">Schema (JSON)</h3>
        {isDirty && (
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={resetChanges}
            >
              Reset
            </Button>
            <Button 
              size="sm" 
              onClick={applyChanges} 
              disabled={!!error}
            >
              Apply
            </Button>
          </div>
        )}
      </div>
      
      {error && (
        <div className="p-2 text-xs bg-red-50 text-red-500 border-b border-red-200">
          {error}
        </div>
      )}
      
      <div className="flex-1 min-h-0">
        <MonacoEditor
          height="100%"
          language="json"
          theme="vs-dark"
          value={jsonValue}
          options={{
            minimap: { enabled: false },
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            formatOnPaste: true,
            formatOnType: true
          }}
          onChange={handleJsonChange}
        />
      </div>
    </Card>
  );
}
