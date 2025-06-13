import { useSchemaState } from "../hooks/useSchemaState.js";
import { Button } from "@repo/design-system/components/ui/button";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { useState } from "react";

export function AIPromptPanel() {
  const { setSchema } = useSchemaState();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSchema = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate-schema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      setSchema(data);
    } catch (err) {
      console.error("AI error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">AI Assistant</h3>
      <Textarea
        rows={3}
        placeholder="Create a form for user profile with name, email, and bio"
        value={prompt}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
      />
      <Button onClick={generateSchema} disabled={loading || !prompt} className="w-full">
        {loading ? "Generating..." : "Generate View"}
      </Button>
    </div>
  );
}
