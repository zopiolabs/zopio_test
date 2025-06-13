import type { ViewSchema } from "@repo/view-engine/renderers/types";

/**
 * Interface for view storage providers
 */
export interface ViewStorageProvider {
  /**
   * Save a view schema to storage
   * @param id Unique identifier for the view
   * @param view The view schema to save
   * @returns Promise that resolves when the view is saved
   */
  saveView(id: string, view: ViewSchema): Promise<void>;

  /**
   * Get a view schema from storage
   * @param id Unique identifier for the view
   * @returns Promise that resolves with the view schema or undefined if not found
   */
  getView(id: string): Promise<ViewSchema | undefined>;

  /**
   * List all view IDs in storage
   * @returns Promise that resolves with an array of view IDs
   */
  listViews(): Promise<string[]>;

  /**
   * Delete a view from storage
   * @param id Unique identifier for the view to delete
   * @returns Promise that resolves when the view is deleted
   */
  deleteView(id: string): Promise<void>;
}
