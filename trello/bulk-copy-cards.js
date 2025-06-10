import './types.js';
import { getCurrentBoardId, getDscToken, getBoard, logWithTimestamp } from './utils.js';

/**
 * Configuration options for bulk copying cards between boards
 * @typedef {Object} BulkCopyConfig
 * @property {string} targetBoardId - The ID of the target board to copy cards to
 * @property {Object<string, string>} [listMapping] - Optional mapping of source list names to target list names
 * @property {boolean} dryRun - If true, only logs what would be done without making changes
 * @property {string} [sourceBoardId] - Optional source board ID, defaults to current board
 * @property {function(TrelloCard): boolean} [cardFilter] - Optional function to filter which cards to copy
 * @property {string} [keepFromSource] - Comma-separated list of properties to keep from source card
 */

/**
 * Create a new card by copying from an existing card
 * @param {string} sourceCardId - The ID of the source card to copy
 * @param {string} targetListId - The ID of the target list
 * @param {string} cardName - The name for the new card
 * @param {string} keepFromSource - Properties to keep from source card
 * @param {string} dsc - The DSC token for authentication
 * @returns {Promise<any>} The response from the Trello API
 * @throws {Error} If the card creation fails
 */
async function copyCard(sourceCardId, targetListId, cardName, keepFromSource, dsc) {
  const response = await fetch("https://trello.com/1/cards", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      dsc,
      idCardSource: sourceCardId,
      idList: targetListId,
      name: cardName,
      keepFromSource,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to copy card: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Find a target list by name, optionally using list mapping
 * @param {TrelloList[]} targetLists - Array of target board lists
 * @param {string} sourceListName - Name of the source list
 * @param {Object<string, string>} listMapping - Mapping of source to target list names
 * @returns {TrelloList|null} The target list or null if not found
 */
function findTargetList(targetLists, sourceListName, listMapping = {}) {
  const targetListName = listMapping[sourceListName] || sourceListName;
  return targetLists.find(list => list.name === targetListName) || null;
}

/**
 * Bulk copy cards from one board to another
 * @param {BulkCopyConfig} config - Configuration options
 * @returns {Promise<{processed: number, success: number, errors: Array<{cardId: string, name: string, error: string}>, skippedLists: string[]}>} Results summary
 */
export async function bulkCopyCards(config) {
  const {
    targetBoardId,
    listMapping = {},
    dryRun = true,
    sourceBoardId = getCurrentBoardId(),
    cardFilter = null,
    keepFromSource = "start,due,dueReminder,labels"
  } = config;

  if (!targetBoardId) {
    throw new Error('targetBoardId must be provided');
  }

  logWithTimestamp(`Starting bulk copy operation from board ${sourceBoardId} to ${targetBoardId}`);
  logWithTimestamp(`List mapping:`, listMapping);
  logWithTimestamp(`Dry run: ${dryRun}`);

  const dsc = await getDscToken();
  const sourceBoard = await getBoard(sourceBoardId);
  const targetBoard = await getBoard(targetBoardId);
  
  const results = {
    processed: 0,
    success: 0,
    errors: [],
    skippedLists: []
  };

  // Build a map of source lists for quick lookup
  const sourceListsMap = new Map(sourceBoard.lists.map(list => [list.id, list]));

  for (const card of sourceBoard.cards) {
    // Apply card filter if provided
    if (cardFilter && !cardFilter(card)) {
      continue;
    }

    const sourceList = sourceListsMap.get(card.idList);
    if (!sourceList) {
      logWithTimestamp(`Warning: Source list not found for card "${card.name}"`);
      continue;
    }

    const targetList = findTargetList(targetBoard.lists, sourceList.name, listMapping);
    
    if (!targetList) {
      if (!results.skippedLists.includes(sourceList.name)) {
        results.skippedLists.push(sourceList.name);
        logWithTimestamp(`List "${sourceList.name}" not found in target board`);
      }
      continue;
    }

    results.processed++;

    if (dryRun) {
      logWithTimestamp(`Dry run: Copy "${card.name}" | ${sourceList.name} -> ${targetList.name}`);
      results.success++;
      continue;
    }

    try {
      const response = await copyCard(card.id, targetList.id, card.name, keepFromSource, dsc);
      logWithTimestamp(`Copied card "${card.name}" | ${sourceList.name} -> ${targetList.name}`, response);
      results.success++;
    } catch (error) {
      const errorInfo = {
        cardId: card.id,
        name: card.name,
        error: error.message
      };
      results.errors.push(errorInfo);
      logWithTimestamp(`Error copying card "${card.name}": ${error.message}`);
    }
  }

  logWithTimestamp(`Operation completed. Processed: ${results.processed}, Success: ${results.success}, Errors: ${results.errors.length}`);
  
  if (results.skippedLists.length > 0) {
    logWithTimestamp(`Lists not found in target board: ${results.skippedLists.join(', ')}`);
  }

  return results;
}

/**
 * Simple execution function for direct browser console usage
 * @param {string} targetBoardId - The ID of the target board
 * @param {Object<string, string>} [listMapping={}] - Optional mapping of list names
 * @param {boolean} [dryRun=true] - Whether to perform dry run
 * @returns {Promise<any>} Results summary
 */
export async function copyAllCards(targetBoardId, listMapping = {}, dryRun = true) {
  return bulkCopyCards({
    targetBoardId,
    listMapping,
    dryRun
  });
}
