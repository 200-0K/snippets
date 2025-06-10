# Trello Bulk Operations Library

A collection of JavaScript utilities for performing bulk operations on Trello boards directly from your browser's developer console. All operations support dry-run mode for safe testing before making actual changes.

## 🚀 Quick Start

### Browser Usage (Recommended)

1. Open any Trello board in your browser
2. Open the browser developer console (F12)
3. Import the library:

```javascript
// Import the entire library
const trello = await import('https://raw.githubusercontent.com/200-0K/snippets/refs/heads/master/trello/index.js');

// Or import specific functions
const { quickDeleteByLabel, quickAddLabels, quickCopyCards } = await import('https://raw.githubusercontent.com/200-0K/snippets/refs/heads/master/trello/index.js');
```

## 📚 Available Operations

### 1. Bulk Delete/Archive Cards by Label

Delete or archive cards that have specific labels.

```javascript
// Archive all cards with "Website" label (dry run - safe to test)
await trello.quickDeleteByLabel(['Website']);

// Actually archive the cards (remove 'true' or set to 'false')
await trello.quickDeleteByLabel(['Website'], false);

// Advanced usage with full configuration
await trello.bulkDeleteCardsByLabel({
  targetLabels: ['Website', 'Old'],
  action: 'delete', // or 'archive'
  dryRun: true,
  boardId: 'optional-board-id' // defaults to current board
});
```

### 2. Bulk Add Labels to Cards

Add labels to all cards on a board.

```javascript
// Add "General" label to all cards (dry run)
await trello.quickAddLabels(['General']);

// Actually add the labels
await trello.quickAddLabels(['General'], false);

// Advanced usage with card filtering
await trello.bulkAddLabels({
  labelNames: ['Important', 'Review'],
  dryRun: true,
  cardFilter: (card) => card.name.includes('Bug') // Only cards with "Bug" in name
});
```

### 3. Bulk Copy Cards Between Boards

Copy cards from one board to another.

```javascript
// Copy all cards to another board (dry run)
await trello.quickCopyCards('TARGET_BOARD_ID');

// Actually copy the cards
await trello.quickCopyCards('TARGET_BOARD_ID', false);

// Advanced usage with list mapping
await trello.bulkCopyCards({
  targetBoardId: 'TARGET_BOARD_ID',
  listMapping: {
    'Backlog': 'To Do',      // Source list -> Target list
    'In Progress': 'Doing'
  },
  dryRun: true,
  keepFromSource: 'start,due,dueReminder,labels,attachments'
});
```

## 🛡️ Safety Features

- **Dry Run Mode**: All functions default to dry-run mode, showing what would happen without making changes
- **Error Handling**: Comprehensive error handling with detailed error messages  
- **Logging**: Timestamped logging for all operations
- **Validation**: Input validation to prevent common mistakes

## 📖 Function Reference

### Utility Functions

```javascript
// Get the current board ID from URL
const boardId = trello.getCurrentBoardId();

// Get authentication token
const dscToken = await trello.getDscToken();

// Fetch complete board data
const board = await trello.getBoard(boardId);

// Utility functions
await trello.sleep(1000); // Wait 1 second
trello.logWithTimestamp('Custom message');
```

### Advanced Configuration Objects

#### BulkDeleteConfig
```javascript
{
  targetLabels: string[],           // Required: Label names to target
  action: 'archive' | 'delete',    // Action to perform
  dryRun: boolean,                  // Safety mode
  boardId?: string                  // Optional board ID
}
```

#### BulkAddLabelsConfig  
```javascript
{
  labelNames: string[],             // Required: Labels to add
  dryRun: boolean,                  // Safety mode
  boardId?: string,                 // Optional board ID
  cardFilter?: (card) => boolean    // Optional card filter function
}
```

#### BulkCopyConfig
```javascript
{
  targetBoardId: string,            // Required: Target board ID
  listMapping?: object,             // Optional list name mapping
  dryRun: boolean,                  // Safety mode
  sourceBoardId?: string,           // Optional source board ID
  cardFilter?: (card) => boolean,   // Optional card filter function
  keepFromSource?: string           // Properties to copy
}
```

## 🔧 Examples

### Example 1: Clean up old cards
```javascript
// First, see what would be deleted (dry run)
const result = await trello.quickDeleteByLabel(['Completed', 'Old']);
console.log(`Would delete ${result.processed} cards`);

// If happy with the result, actually delete them
if (result.processed > 0) {
  await trello.quickDeleteByLabel(['Completed', 'Old'], false);
}
```

### Example 2: Organize cards with labels
```javascript  
// Add "Needs Review" label to all cards containing "draft"
await trello.bulkAddLabels({
  labelNames: ['Needs Review'],
  dryRun: false,
  cardFilter: (card) => card.name.toLowerCase().includes('draft')
});
```

### Example 3: Migrate board content
```javascript
// Copy only high priority cards to new board
await trello.bulkCopyCards({
  targetBoardId: 'NEW_BOARD_ID',
  listMapping: {
    'Backlog': 'New Ideas',
    'Sprint': 'Current Sprint'  
  },
  dryRun: false,
  cardFilter: (card) => card.labels.some(label => label.name === 'High Priority')
});
```

## ⚠️ Important Notes

1. **Always test with dry run first** - Set `dryRun: true` to see what would happen
2. **Check permissions** - Make sure you have edit access to the boards
3. **Rate limiting** - The library doesn't implement rate limiting, so be considerate
4. **Browser console only** - This library is designed for browser console usage
5. **Backup important data** - Always backup important boards before bulk operations

## 🐛 Troubleshooting

### Common Issues

**"Unable to extract board ID from URL"**
- Make sure you're on a Trello board page (not the dashboard)
- URL should look like: `https://trello.com/b/BOARD_ID/board-name`

**"DSC cookie not found"**  
- Make sure you're logged in to Trello
- Try refreshing the page and running the script again

**"Labels not found on board"**
- Check that the label names match exactly (case-sensitive)
- Use `trello.getBoard().then(b => console.log(b.labels))` to see available labels

**"List not found in target board"**
- Verify the target board has lists with matching names
- Use list mapping to handle different list names

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!