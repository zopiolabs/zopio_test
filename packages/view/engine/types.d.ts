// Type declarations for external modules
declare module '@repo/crud/ui/auto/AutoForm' {
  import type { FC } from 'react';
  export interface AutoFormProps {
    schema: string;
    [key: string]: unknown;
  }
  export const AutoForm: FC<AutoFormProps>;
}

declare module '@repo/crud/ui/auto/AutoTable' {
  import type { FC } from 'react';
  export interface AutoTableProps {
    schema: string;
    [key: string]: unknown;
  }
  export const AutoTable: FC<AutoTableProps>;
}

declare module '@repo/crud/ui/auto/AutoDetail' {
  import type { FC } from 'react';
  export interface AutoDetailProps {
    schema: string;
    [key: string]: unknown;
  }
  export const AutoDetail: FC<AutoDetailProps>;
}

declare module '@repo/crud/ui/auto/AutoAuditLogView' {
  import type { FC } from 'react';
  export interface AutoAuditLogViewProps {
    schema: string;
    [key: string]: unknown;
  }
  export const AutoAuditLogView: FC<AutoAuditLogViewProps>;
}

declare module '@repo/crud/ui/auto/AutoImport' {
  import type { FC } from 'react';
  export interface AutoImportProps {
    schema: string;
    [key: string]: unknown;
  }
  export const AutoImport: FC<AutoImportProps>;
}

declare module '@repo/crud/ui/auto/AutoExport' {
  import type { FC } from 'react';
  export interface AutoExportProps {
    schema: string;
    [key: string]: unknown;
  }
  export const AutoExport: FC<AutoExportProps>;
}
