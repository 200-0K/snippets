import './types.js';

/**
 * Get the current board ID from the URL
 * @returns {string} The board ID
 * @throws {Error} If board ID cannot be extracted from URL
 */
export function getCurrentBoardId() {
  const match = window.location.pathname.match(/(?<=\/b\/).*?(?=\/)/);
  if (!match || !match[0]) {
    throw new Error('Unable to extract board ID from URL. Make sure you are on a Trello board page.');
  }
  return match[0];
}

/**
 * Get the DSC cookie value for authentication
 * @returns {Promise<string>} The DSC cookie value
 * @throws {Error} If DSC cookie is not found
 */
export async function getDscToken() {
  const dscCookie = await cookieStore.get("dsc");
  if (!dscCookie || !dscCookie.value) {
    throw new Error('DSC cookie not found. Make sure you are logged in to Trello.');
  }
  return dscCookie.value;
}

/**
 * Fetches a Trello board and its associated data
 * @param {string} boardId - The ID of the Trello board to fetch
 * @returns {Promise<TrelloBoard>} The board data with cards, labels, and lists
 * @throws {Error} If the board cannot be fetched
 */
export async function getBoard(boardId) {
  try {
    const response = await fetch(
      `https://trello.com/1/board/${boardId}?fields=id&cards=visible&card_fields=id%2ClabelNames%2Caddress%2Cbadges%2CcardRole%2Cclosed%2Ccoordinates%2Ccover%2CcreationMethod%2CcreationMethodError%2CcreationMethodLoadingStartedAt%2CdateLastActivity%2Cdesc%2CdescData%2Cdue%2CdueComplete%2CdueReminder%2CidAttachmentCover%2CidBoard%2CidLabels%2CidList%2CidMembers%2CidShort%2CisTemplate%2Clabels%2Climits%2ClocationName%2CmirrorSourceId%2Cname%2CnodeId%2Cpinned%2Cpos%2CshortLink%2CshortUrl%2Cstart%2Csubscribed%2Curl&card_attachments=true&card_attachment_fields=id%2Cbytes%2Cdate%2CedgeColor%2CfileName%2CidMember%2CisMalicious%2CisUpload%2CmimeType%2Cname%2Cpos%2Curl&card_checklists=all&card_checklist_fields=id%2CidBoard%2CidCard%2Cname%2Cpos&card_checklist_checkItems=none&card_customFieldItems=true&card_pluginData=true&card_stickers=true&labels=all&lists=open&list_fields=id%2Cclosed%2Ccolor%2CcreationMethod%2Cdatasource%2CidBoard%2Climits%2Cname%2CnodeId%2Cpos%2CsoftLimit%2Csubscribed%2Ctype`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch board: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching board ${boardId}: ${error.message}`);
  }
}

/**
 * Sleep for a specified number of milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Log a message with timestamp
 * @param {string} message - The message to log
 * @param {any} [data] - Optional data to log
 */
export function logWithTimestamp(message, data = null) {
  const timestamp = new Date().toISOString();
  if (data) {
    console.log(`[${timestamp}] ${message}`, data);
  } else {
    console.log(`[${timestamp}] ${message}`);
  }
} 