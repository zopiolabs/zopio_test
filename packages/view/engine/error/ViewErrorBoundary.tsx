import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useViewTranslations } from '../../i18n';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error) => ReactNode);
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component for catching and displaying view rendering errors
 */
class ErrorBoundaryComponent extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('View rendering error:', error, errorInfo);
  }

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      // If a custom fallback is provided, use it
      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback(error);
        }
        return fallback;
      }

      // Default error UI
      return (
        <div className="p-4 border border-red-500 bg-red-50 rounded-md">
          <h3 className="text-lg font-semibold text-red-700 mb-2">View Rendering Error</h3>
          <p className="text-sm text-red-600 mb-2">
            An error occurred while rendering this view.
          </p>
          <details className="text-xs">
            <summary className="cursor-pointer font-medium mb-1">Error details</summary>
            <pre className="overflow-auto p-2 bg-white border border-red-200 rounded">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        </div>
      );
    }

    return children;
  }
}

/**
 * Wrapper component that provides translations to the error message
 */
export function ViewErrorBoundary({ children, fallback }: ErrorBoundaryProps): JSX.Element {
  const t = useViewTranslations();
  
  const defaultFallback = (error: Error) => (
    <div className="p-4 border border-red-500 bg-red-50 rounded-md">
      <h3 className="text-lg font-semibold text-red-700 mb-2">
        {t('error.title')}
      </h3>
      <p className="text-sm text-red-600 mb-2">
        {t('error.renderingFailed')}
      </p>
      <details className="text-xs">
        <summary className="cursor-pointer font-medium mb-1">
          {t('error.details')}
        </summary>
        <pre className="overflow-auto p-2 bg-white border border-red-200 rounded">
          {error.message}
          {error.stack && `\n\n${error.stack}`}
        </pre>
      </details>
    </div>
  );
  
  return (
    <ErrorBoundaryComponent fallback={fallback || defaultFallback}>
      {children}
    </ErrorBoundaryComponent>
  );
}
