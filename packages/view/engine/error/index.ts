export { ViewErrorBoundary } from './ViewErrorBoundary';

/**
 * Custom error classes for the view package
 */

/**
 * Base error class for view-related errors
 */
export class ViewError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ViewError';
  }
}

/**
 * Error thrown when a view schema is invalid
 */
export class ViewSchemaValidationError extends ViewError {
  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = 'ViewSchemaValidationError';
  }
}

/**
 * Error thrown when a view type is not supported
 */
export class UnsupportedViewTypeError extends ViewError {
  constructor(type: string) {
    super(`Unsupported view type: ${type}`);
    this.name = 'UnsupportedViewTypeError';
  }
}

/**
 * Error thrown when a view schema is not found
 */
export class ViewNotFoundError extends ViewError {
  constructor(id: string) {
    super(`View not found: ${id}`);
    this.name = 'ViewNotFoundError';
  }
}

/**
 * Error thrown when there's an issue with rendering a view
 */
export class ViewRenderingError extends ViewError {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'ViewRenderingError';
    
    // Preserve the original error stack if available
    if (originalError?.stack) {
      this.stack = `${this.stack}\nCaused by: ${originalError.stack}`;
    }
  }
}
