import './types.js';
import { getCurrentBoardId, getDscToken, getBoard, logWithTimestamp } from './utils.js';

/**
 * Configuration options for bulk adding labels to cards
 * @typedef {Object} BulkAddLabelsConfig
 * @property {string[]} labelNames - Array of label names to add to all cards
 * @property {boolean} dryRun - If true, only logs what would be done without making changes
 * @property {string} [boardId] - Optional board ID, defaults to current board
 * @property {function(TrelloCard): boolean} [cardFilter] - Optional function to filter which cards to process
 */

/**
 * Update a card's labels by adding new ones to existing ones
 * @param {string} cardId - The ID of the card to update
 * @param {string[]} newLabelIds - Array of label IDs to add
 * @param {string} dsc - The DSC token for authentication
 * @returns {Promise<any>} The response from the Trello API
 * @throws {Error} If the card update fails
 */
async function updateCardLabels(cardId, newLabelIds, dsc) {
  const response = await fetch(`https://trello.com/1/cards/${cardId}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      dsc,
      idLabels: newLabelIds,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update card labels: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get label IDs by their names from a board's labels
 * @param {TrelloLabel[]} boardLabels - Array of all board labels
 * @param {string[]} labelNames - Array of label names to find
 * @returns {{found: string[], missing: string[]}} Object with found label IDs and missing label names
 */
function getLabelIdsByNames(boardLabels, labelNames) {
  const found = [];
  const missing = [];

  for (const labelName of labelNames) {
    const label = boardLabels.find(l => l.name === labelName);
    if (label) {
      found.push(label.id);
    } else {
      missing.push(labelName);
    }
  }

  return { found, missing };
}

/**
 * Format label names for display, handling empty arrays
 * @param {TrelloLabel[]} labels - Array of labels
 * @param {TrelloLabel[]} allLabels - Array of all board labels for ID lookup
 * @param {string[]} labelIds - Array of label IDs to display
 * @returns {string} Formatted label names string
 */
function formatLabelNames(labels, allLabels, labelIds) {
  if (!labelIds || labelIds.length === 0) return 'N/A';
  
  return allLabels
    .filter(l => labelIds.includes(l.id))
    .map(l => l.name || l.color)
    .join(', ');
}

/**
 * Bulk add labels to all cards on a board
 * @param {BulkAddLabelsConfig} config - Configuration options
 * @returns {Promise<{processed: number, success: number, errors: Array<{cardId: string, name: string, error: string}>, missingLabels: string[]}>} Results summary
 */
export async function bulkAddLabels(config) {
  const {
    labelNames,
    dryRun = true,
    boardId = getCurrentBoardId(),
    cardFilter = null
  } = config;

  if (!labelNames || labelNames.length === 0) {
    throw new Error('labelNames must be provided and non-empty');
  }

  logWithTimestamp(`Starting bulk add labels operation for: ${labelNames.join(', ')}`);
  logWithTimestamp(`Dry run: ${dryRun}`);

  const dsc = await getDscToken();
  const board = await getBoard(boardId);
  
  const { found: newLabelIds, missing: missingLabels } = getLabelIdsByNames(board.labels, labelNames);
  
  if (missingLabels.length > 0) {
    logWithTimestamp(`Warning: Labels not found on board: ${missingLabels.join(', ')}`);
  }

  if (newLabelIds.length === 0) {
    throw new Error('No valid labels found on the board');
  }

  const results = {
    processed: 0,
    success: 0,
    errors: [],
    missingLabels
  };

  for (const card of board.cards) {
    // Apply card filter if provided
    if (cardFilter && !cardFilter(card)) {
      continue;
    }

    const currentLabelIds = card.labels.map(l => l.id);
    const combinedLabelIds = Array.from(new Set([...currentLabelIds, ...newLabelIds]));
    
    // Skip if no new labels would be added
    if (combinedLabelIds.length === currentLabelIds.length) {
      continue;
    }

    results.processed++;

    if (dryRun) {
      const currentLabels = formatLabelNames(card.labels, board.labels, currentLabelIds) || 'N/A';
      const newLabels = formatLabelNames([], board.labels, combinedLabelIds);
      
      logWithTimestamp(`Dry run: "${card.name}" | ${currentLabels} -> ${newLabels}`);
      results.success++;
      continue;
    }

    try {
      const response = await updateCardLabels(card.id, combinedLabelIds, dsc);
      logWithTimestamp(`Updated card "${card.name}"`, response);
      results.success++;
    } catch (error) {
      const errorInfo = {
        cardId: card.id,
        name: card.name,
        error: error.message
      };
      results.errors.push(errorInfo);
      logWithTimestamp(`Error updating card "${card.name}": ${error.message}`);
    }
  }

  logWithTimestamp(`Operation completed. Processed: ${results.processed}, Success: ${results.success}, Errors: ${results.errors.length}`);
  return results;
}

/**
 * Simple execution function for direct browser console usage
 * @param {string[]} labelNames - Array of label names to add to all cards
 * @param {boolean} [dryRun=true] - Whether to perform dry run
 * @returns {Promise<any>} Results summary
 */
export async function addLabelsToAllCards(labelNames, dryRun = true) {
  return bulkAddLabels({
    labelNames,
    dryRun
  });
}
