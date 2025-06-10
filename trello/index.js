/**
 * Trello Bulk Operations Library
 * 
 * A collection of utilities for performing bulk operations on Trello boards.
 * All operations support dry-run mode for safe testing.
 * 
 * @author 200-0k
 * @version 1.0.0
 */

// Import and re-export utility functions
export {
  getCurrentBoardId,
  getDscToken,
  getBoard,
  sleep,
  logWithTimestamp
} from './utils.js';

// Import and re-export bulk delete functions
export {
  bulkDeleteCardsByLabel,
  deleteCardsByLabel
} from './bulk-delete-cards-by-label.js';

// Import and re-export bulk add labels functions
export {
  bulkAddLabels,
  addLabelsToAllCards
} from './bulk-add-labels.js';

// Import and re-export bulk copy functions
export {
  bulkCopyCards,
  copyAllCards
} from './bulk-copy-cards.js';

/**
 * Quick access functions for common operations
 */

/**
 * Quick function to delete cards by label with minimal configuration
 * @param {string[]} labelNames - Array of label names to target
 * @param {boolean} [dryRun=true] - Whether to perform dry run
 * @returns {Promise<any>} Results summary
 * @example
 * // Delete all cards with "Website" label (dry run)
 * await quickDeleteByLabel(['Website']);
 * 
 * // Actually delete cards (be careful!)
 * await quickDeleteByLabel(['Website'], false);
 */
export async function quickDeleteByLabel(labelNames, dryRun = true) {
  const { deleteCardsByLabel } = await import('./bulk-delete-cards-by-label.js');
  return deleteCardsByLabel(labelNames, 'archive', dryRun);
}

/**
 * Quick function to add labels to all cards
 * @param {string[]} labelNames - Array of label names to add
 * @param {boolean} [dryRun=true] - Whether to perform dry run
 * @returns {Promise<any>} Results summary
 * @example
 * // Add "General" label to all cards (dry run)
 * await quickAddLabels(['General']);
 * 
 * // Actually add labels
 * await quickAddLabels(['General'], false);
 */
export async function quickAddLabels(labelNames, dryRun = true) {
  const { addLabelsToAllCards } = await import('./bulk-add-labels.js');
  return addLabelsToAllCards(labelNames, dryRun);
}

/**
 * Quick function to copy all cards to another board
 * @param {string} targetBoardId - Target board ID
 * @param {boolean} [dryRun=true] - Whether to perform dry run
 * @returns {Promise<any>} Results summary
 * @example
 * // Copy all cards to another board (dry run)
 * await quickCopyCards('YOUR_TARGET_BOARD_ID');
 * 
 * // Actually copy cards
 * await quickCopyCards('YOUR_TARGET_BOARD_ID', false);
 */
export async function quickCopyCards(targetBoardId, dryRun = true) {
  const { copyAllCards } = await import('./bulk-copy-cards.js');
  return copyAllCards(targetBoardId, {}, dryRun);
}

// Default export for convenience
export default {
  // Utilities
  getCurrentBoardId,
  getDscToken,
  getBoard,
  sleep,
  logWithTimestamp,
  
  // Bulk operations
  bulkDeleteCardsByLabel,
  deleteCardsByLabel,
  bulkAddLabels,
  addLabelsToAllCards,
  bulkCopyCards,
  copyAllCards,
  
  // Quick functions
  quickDeleteByLabel,
  quickAddLabels,
  quickCopyCards
};
