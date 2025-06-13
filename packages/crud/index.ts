/**
 * @repo/crud
 * 
 * Main entry point for the Zopio CRUD framework. This package extends the data package
 * with additional features like permissions, auditing, and plugins.
 * 
 * The package is organized into several subpackages:
 * - engine: Core CRUD functionality built on top of data providers
 * - hooks: React hooks for CRUD operations
 * - ui: UI components for CRUD operations
 * - permissions: Access control for CRUD operations
 * - plugins: Extensibility points for CRUD operations
 * - audit: Tracking changes to data
 */

/**
 * Engine Package
 * 
 * Core CRUD functionality built on top of data providers.
 */
export * as engine from './engine/index.js';

/**
 * Hooks Package
 * 
 * React hooks for CRUD operations.
 */
export * as hooks from './hooks/index.js';

/**
 * UI Package
 * 
 * UI components for CRUD operations.
 */
export * as ui from './ui/index.js';

/**
 * Permissions Package
 * 
 * Access control for CRUD operations.
 */
export * as permissions from './permissions/index.js';

/**
 * Plugins Package
 * 
 * Extensibility points for CRUD operations.
 */
export * as plugins from './plugins/index.js';

/**
 * Audit Package
 * 
 * Tracking changes to data.
 */
export * as audit from './audit/index.js';
