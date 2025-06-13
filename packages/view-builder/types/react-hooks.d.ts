/**
 * Custom type declarations for React hooks to fix TypeScript errors
 */
import type { FormField } from '../hooks/useSchemaState';

declare module 'react' {
  /**
   * Extended useCallback hook with better type support for FormField
   */
  export function useCallback<T extends (field: FormField) => void>(
    callback: T,
    deps: React.DependencyList
  ): T;

  /**
   * Extended useCallback hook for field updates
   */
  export function useCallback<T extends (name: string, updates: Partial<FormField>) => void>(
    callback: T,
    deps: React.DependencyList
  ): T;
  
  // Add React.DragEvent type
  export interface DragEvent<T = Element> extends React.MouseEvent<T> {
    dataTransfer: DataTransfer;
  }
}
