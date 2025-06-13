import React from "react";
import { AutoTable } from "../AutoTable";

const columns = [
  { key: "name", title: "Name" },
  { key: "age", title: "Age" },
  { key: "email", title: "Email" },
  { key: "isActive", title: "Active" }
];

const data = [
  { name: "John", age: 28, email: "john@example.com", isActive: true },
  { name: "Jane", age: 34, email: "jane@example.com", isActive: false }
];

export function AutoTableDemo() {
  return (
    <div>
      <AutoTable columns={columns} data={data} rowActions={row => <button>Edit</button>} />
    </div>
  );
}