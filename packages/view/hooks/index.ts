import React, { createContext, useContext } from "react";
import type { ViewSchema } from "@repo/view-engine/renderers/types";

type ViewHooksContextType = {
  overrideFieldRender?: (field: string, schema: ViewSchema) => React.ReactNode;
  onSubmit?: (schema: ViewSchema, data: any) => Promise<void> | void;
};

const ViewHooksContext = createContext<ViewHooksContextType>({});

export function ViewHooksProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ViewHooksContextType;
}) {
  return (
    <ViewHooksContext.Provider value={value}>
      {children}
    </ViewHooksContext.Provider>
  );
}

export function useViewHooks() {
  return useContext(ViewHooksContext);
}
