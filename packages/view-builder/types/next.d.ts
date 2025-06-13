declare module 'next/dynamic' {
  import { ComponentType } from 'react';

  export interface DynamicOptions {
    loading?: ComponentType;
    ssr?: boolean;
    suspense?: boolean;
  }

  export default function dynamic<P = {}>(
    dynamicImport: () => Promise<{ default: ComponentType<P> }>,
    options?: DynamicOptions
  ): ComponentType<P>;
}

declare module 'react-monaco-editor' {
  import { ComponentType } from 'react';

  export interface MonacoEditorProps {
    width?: string | number;
    height?: string | number;
    value?: string;
    defaultValue?: string;
    language?: string;
    theme?: string;
    options?: object;
    onChange?: (value: string) => void;
    editorDidMount?: (editor: any, monaco: any) => void;
    editorWillMount?: (monaco: any) => void;
    className?: string;
  }

  const MonacoEditor: ComponentType<MonacoEditorProps>;
  export default MonacoEditor;
}

declare module '@repo/view/engine/validation/schema' {
  export interface ValidationResult<T> {
    success: boolean;
    data?: T;
    error?: string;
  }

  export function safeValidateViewSchema<T>(schema: unknown): ValidationResult<T>;
}
