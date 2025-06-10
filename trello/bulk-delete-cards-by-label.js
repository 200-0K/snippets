import './types.js';
import { getCurrentBoardId, getDscToken, getBoard, logWithTimestamp } from './utils.js';

/**
 * Configuration options for bulk deleting cards by label
 * @typedef {Object} BulkDeleteConfig
 * @property {string[]} targetLabels - Array of label names to target for deletion
 * @property {CardAction} action - Action to perform: 'archive' or 'delete'
 * @property {boolean} dryRun - If true, only logs what would be done without making changes
 * @property {string} [boardId] - Optional board ID, defaults to current board
 */

/**
 * Delete or archive a single card
 * @param {string} cardId - The ID of the card to delete/archive
 * @param {CardAction} action - The action to perform ('archive' or 'delete')
 * @param {string} dsc - The DSC token for authentication
 * @returns {Promise<any>} The response from the Trello API
 * @throws {Error} If the card operation fails
 */
async function deleteCard(cardId, action, dsc) {
  const response = await fetch(`https://trello.com/1/cards/${cardId}`, {
    method: action === "archive" ? "PUT" : "DELETE",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      dsc,
      closed: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to ${action} card: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Check if a card has any of the target labels
 * @param {TrelloCard} card - The card to check
 * @param {string[]} targetLabels - Array of label names to check for
 * @returns {boolean} True if card has any of the target labels
 */
function cardHasTargetLabel(card, targetLabels) {
  return card.labels.some(label => targetLabels.includes(label.name));
}

/**
 * Bulk delete or archive cards that have specific labels
 * @param {BulkDeleteConfig} config - Configuration options
 * @returns {Promise<{processed: number, success: number, errors: Array<{cardId: string, name: string, error: string}>}>} Results summary
 */
export async function bulkDeleteCardsByLabel(config) {
  const {
    targetLabels,
    action = 'archive',
    dryRun = true,
    boardId = getCurrentBoardId()
  } = config;

  if (!targetLabels || targetLabels.length === 0) {
    throw new Error('targetLabels must be provided and non-empty');
  }

  if (!['archive', 'delete'].includes(action)) {
    throw new Error('action must be either "archive" or "delete"');
  }

  logWithTimestamp(`Starting bulk ${action} operation for cards with labels: ${targetLabels.join(', ')}`);
  logWithTimestamp(`Dry run: ${dryRun}`);

  const dsc = await getDscToken();
  const board = await getBoard(boardId);
  
  const results = {
    processed: 0,
    success: 0,
    errors: []
  };

  for (const card of board.cards) {
    if (!cardHasTargetLabel(card, targetLabels)) {
      continue;
    }

    results.processed++;

    if (dryRun) {
      logWithTimestamp(`Dry run: ${action} card "${card.name}"`);
      results.success++;
      continue;
    }

    try {
      const response = await deleteCard(card.id, action, dsc);
      logWithTimestamp(`${action.charAt(0).toUpperCase() + action.slice(1)} card "${card.name}"`, response);
      results.success++;
    } catch (error) {
      const errorInfo = {
        cardId: card.id,
        name: card.name,
        error: error.message
      };
      results.errors.push(errorInfo);
      logWithTimestamp(`Error ${action}ing card "${card.name}": ${error.message}`);
    }
  }

  logWithTimestamp(`Operation completed. Processed: ${results.processed}, Success: ${results.success}, Errors: ${results.errors.length}`);
  return results;
}

/**
 * Simple execution function for direct browser console usage
 * @param {string[]} targetLabels - Array of label names to target
 * @param {CardAction} [action='archive'] - Action to perform
 * @param {boolean} [dryRun=true] - Whether to perform dry run
 * @returns {Promise<any>} Results summary
 */
export async function deleteCardsByLabel(targetLabels, action = 'archive', dryRun = true) {
  return bulkDeleteCardsByLabel({
    targetLabels,
    action,
    dryRun
  });
}
