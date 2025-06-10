/**
 * @typedef {Object} TrelloCard
 * @property {string} id - The ID of the card
 * @property {*} address
 * @property {Object} badges
 * @property {number} badges.attachments
 * @property {string} badges.fogbugz
 * @property {number} badges.checkItems
 * @property {number} badges.checkItemsChecked
 * @property {*} badges.checkItemsEarliestDue
 * @property {number} badges.comments
 * @property {boolean} badges.description
 * @property {string} [badges.due]
 * @property {boolean} badges.dueComplete
 * @property {boolean} badges.lastUpdatedByAi
 * @property {*} badges.start
 * @property {*} badges.externalSource
 * @property {Object} badges.attachmentsByType
 * @property {Object} badges.attachmentsByType.trello
 * @property {number} badges.attachmentsByType.trello.board
 * @property {number} badges.attachmentsByType.trello.card
 * @property {boolean} badges.location
 * @property {number} badges.votes
 * @property {number} badges.maliciousAttachments
 * @property {boolean} badges.viewingMemberVoted
 * @property {boolean} badges.subscribed
 * @property {*} cardRole
 * @property {boolean} closed
 * @property {*} coordinates
 * @property {Object} cover
 * @property {*} cover.idAttachment
 * @property {*} cover.color
 * @property {*} cover.idUploadedBackground
 * @property {string} cover.size
 * @property {string} cover.brightness
 * @property {*} cover.idPlugin
 * @property {*} creationMethod
 * @property {*} creationMethodError
 * @property {*} creationMethodLoadingStartedAt
 * @property {string} dateLastActivity
 * @property {string} desc
 * @property {Object} descData
 * @property {Object} descData.emoji
 * @property {string} [due]
 * @property {boolean} dueComplete
 * @property {number} [dueReminder]
 * @property {*} idAttachmentCover
 * @property {string} idBoard
 * @property {string[]} idLabels
 * @property {string} idList
 * @property {*[]} idMembers
 * @property {number} idShort
 * @property {boolean} isTemplate
 * @property {TrelloLabel[]} labels
 * @property {Object} limits
 * @property {Object} limits.attachments
 * @property {Object} limits.attachments.perCard
 * @property {string} limits.attachments.perCard.status
 * @property {number} limits.attachments.perCard.disableAt
 * @property {number} limits.attachments.perCard.warnAt
 * @property {Object} limits.checklists
 * @property {Object} limits.checklists.perCard
 * @property {string} limits.checklists.perCard.status
 * @property {number} limits.checklists.perCard.disableAt
 * @property {number} limits.checklists.perCard.warnAt
 * @property {Object} limits.stickers
 * @property {Object} limits.stickers.perCard
 * @property {string} limits.stickers.perCard.status
 * @property {number} limits.stickers.perCard.disableAt
 * @property {number} limits.stickers.perCard.warnAt
 * @property {*} locationName
 * @property {*} mirrorSourceId
 * @property {string} name
 * @property {string} nodeId
 * @property {boolean} pinned
 * @property {number} pos
 * @property {string} shortLink
 * @property {string} shortUrl
 * @property {*} start
 * @property {boolean} subscribed
 * @property {string} url
 * @property {*[]} stickers
 * @property {TrelloAttachment[]} attachments
 * @property {TrelloChecklist[]} checklists
 * @property {*[]} pluginData
 * @property {*[]} customFieldItems
 */

/**
 * @typedef {Object} TrelloLabel
 * @property {string} id - The ID of the label
 * @property {string} idBoard - The ID of the board
 * @property {string} [idOrganization] - The ID of the organization
 * @property {string} name - The name of the label
 * @property {string} [nodeId] - The node ID
 * @property {string} color - The color of the label
 * @property {number} [uses] - Number of times this label is used
 */

/**
 * @typedef {Object} TrelloList
 * @property {string} id - The ID of the list
 * @property {boolean} closed - Whether the list is closed
 * @property {*} color - The color of the list
 * @property {*} creationMethod - The creation method
 * @property {Object} datasource
 * @property {boolean} datasource.filter
 * @property {string} idBoard - The ID of the board
 * @property {Object} limits
 * @property {Object} limits.cards
 * @property {Object} limits.cards.openPerList
 * @property {string} limits.cards.openPerList.status
 * @property {number} limits.cards.openPerList.disableAt
 * @property {number} limits.cards.openPerList.warnAt
 * @property {Object} limits.cards.totalPerList
 * @property {string} limits.cards.totalPerList.status
 * @property {number} limits.cards.totalPerList.disableAt
 * @property {number} limits.cards.totalPerList.warnAt
 * @property {string} name - The name of the list
 * @property {string} nodeId - The node ID
 * @property {number} pos - The position of the list
 * @property {*} softLimit - The soft limit
 * @property {boolean} subscribed - Whether subscribed
 * @property {*} type - The type of list
 */

/**
 * @typedef {Object} TrelloAttachment
 * @property {string} id - The ID of the attachment
 * @property {number} [bytes] - Size in bytes
 * @property {string} date - The date of attachment
 * @property {*} edgeColor - The edge color
 * @property {string} fileName - The file name
 * @property {string} idMember - The ID of the member
 * @property {boolean} isMalicious - Whether the attachment is malicious
 * @property {boolean} isUpload - Whether it's an upload
 * @property {string} mimeType - The MIME type
 * @property {string} name - The name of the attachment
 * @property {number} pos - The position
 * @property {string} url - The URL of the attachment
 */

/**
 * @typedef {Object} TrelloChecklist
 * @property {string} id - The ID of the checklist
 * @property {string} idBoard - The ID of the board
 * @property {string} idCard - The ID of the card
 * @property {string} name - The name of the checklist
 * @property {number} pos - The position
 */

/**
 * @typedef {Object} TrelloBoard
 * @property {string} id - The ID of the board
 * @property {TrelloCard[]} cards - Array of cards on the board
 * @property {TrelloLabel[]} labels - Array of labels on the board
 * @property {TrelloList[]} lists - Array of lists on the board
 */

/**
 * @typedef {'archive'|'delete'} CardAction
 */

export {}; 