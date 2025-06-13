import React, { useState } from "react";
import { AutoForm } from "../AutoForm";
import { useCrudForm } from "../useCrudForm";

const fields = [
  { name: "name", type: "string", label: "Name", required: true },
  { name: "age", type: "number", label: "Age" },
  { name: "email", type: "string", label: "Email", required: true },
  { name: "isActive", type: "boolean", label: "Active?" }
];

export function AutoFormDemo() {
  const form = useCrudForm({ schema: fields, initial: {} });
  return (
    <div>
      <AutoForm fields={fields} value={form.value} onChange={form.setValue} errors={form.errors} />
      <button className="mt-4" onClick={form.validate}>Validate</button>
      <pre className="mt-4">{JSON.stringify(form.value, null, 2)}</pre>
    </div>
  );
}