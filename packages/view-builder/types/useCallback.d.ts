/**
 * Custom type declarations for React hooks to fix TypeScript errors
 */
declare module 'react' {
  /**
   * Extended useCallback hook with better type support
   */
  export function useCallback<T extends (...args: unknown[]) => unknown>(
    callback: T,
    deps: React.DependencyList
  ): T;

  /**
   * Specific overload for string parameter callbacks
   */
  export function useCallback<T extends (param: string) => void>(
    callback: T,
    deps: React.DependencyList
  ): T;
}
