/**
 * Trello Bulk Operations Library
 * 
 * A collection of utilities for performing bulk operations on Trello boards.
 * All operations support dry-run mode for safe testing.
 * 
 * @author 200-0k
 * @version 1.0.0
 */

// Import all functions first
import {
  getCurrentBoardId,
  getDscToken,
  getBoard,
  sleep,
  logWithTimestamp
} from './utils.js';

import {
  bulkDeleteCardsByLabel,
  deleteCardsByLabel
} from './bulk-delete-cards-by-label.js';

import {
  bulkAddLabels,
  addLabelsToAllCards
} from './bulk-add-labels.js';

import {
  bulkCopyCards,
  copyAllCards
} from './bulk-copy-cards.js';

// Re-export utility functions
export {
  getCurrentBoardId,
  getDscToken,
  getBoard,
  sleep,
  logWithTimestamp
};

// Re-export bulk delete functions
export {
  bulkDeleteCardsByLabel,
  deleteCardsByLabel
};

// Re-export bulk add labels functions
export {
  bulkAddLabels,
  addLabelsToAllCards
};

// Re-export bulk copy functions
export {
  bulkCopyCards,
  copyAllCards
};

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
