## ADDED Requirements

### Requirement: Note Storage Structure

The system SHALL store notes in a structured format:

- **Storage location**:
  - H5: IndexedDB or localStorage with JSON files
  - Mini programs: Platform-specific file system
- **Note data structure**:
  ```json
  {
    "id": "uuid",
    "title": "Note Title",
    "subtitle": "Subtitle",
    "tag": "Tag",
    "source": "https://...",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "textContent": "HTML content",
    "diagramContent": "HTML content",
    "userNotes": "User's annotations"
  }
  ```
- **Index storage**: List of note IDs and metadata for quick listing

#### Scenario: Saving a new note

- **WHEN** user completes note generation
- **THEN** system SHALL save complete note data to storage
- **AND** system SHALL add note to index
- **AND** system SHALL update metadata (createdAt, updatedAt)

### Requirement: Note List Management

The system SHALL display a list of all saved notes:

- **List view**: Card-based layout with title, tag, date
- **Sorting**: Most recent first (by updatedAt)
- **Search**: Filter notes by title or tag
- **Empty state**: Friendly message when no notes exist

#### Scenario: Displaying note list

- **WHEN** user opens notes list page
- **THEN** system SHALL fetch all notes from storage
- **AND** system SHALL display as scrollable list
- **AND** system SHALL show note count in header

#### Scenario: Searching notes

- **WHEN** user types in search box
- **THEN** system SHALL filter notes by title and tag
- **AND** system SHALL update list in real-time
- **AND** system SHALL show "No results" if nothing matches

### Requirement: Note Detail View

The system SHALL display complete note with dual tabs:

- **Tab 1 (文字笔记)**: Full text content with rich formatting
- **Tab 2 (图解)**: Visual diagrams and charts
- **Tab 3 (随手记)**: User's personal annotations
- **Header**: Title, subtitle, tag, source link
- **Navigation**: Back button to return to list

#### Scenario: Opening a note

- **WHEN** user taps on a note in the list
- **THEN** system SHALL navigate to note detail page
- **AND** system SHALL load note data from storage
- **AND** system SHALL display with text tab active by default

### Requirement: Note Deletion

The system SHALL allow users to delete notes:

- **Confirmation**: Show confirmation dialog before deletion
- **Cascade delete**: Remove note data and index entry
- **Feedback**: Show success message after deletion
- **Redirect**: Navigate back to list after deletion

#### Scenario: Deleting a note

- **WHEN** user taps delete button on a note
- **THEN** system SHALL show confirmation dialog
- **WHEN** user confirms deletion
- **THEN** system SHALL remove note from storage
- **AND** system SHALL navigate to notes list
- **AND** system SHALL show "笔记已删除" toast

### Requirement: Note Sharing

The system SHALL support sharing notes:

- **Share content**: Title, URL, optional excerpt
- **Platforms**:
  - Mini programs: Native share menu (WeChat, Alipay)
  - H5: Web Share API or copy-to-clipboard fallback
- **Share format**: Link to view the note (or download HTML)

#### Scenario: Sharing on WeChat

- **WHEN** user taps share button
- **THEN** system SHALL trigger native share menu
- **AND** system SHALL include note title and URL
- **IF** native share is unavailable
- **THEN** system SHALL copy link to clipboard

### Requirement: Note Export

The system SHALL support exporting notes as standalone HTML:

- **Export format**: Self-contained HTML file with all styles
- **Export methods**:
  - H5: Download via `<a download>` attribute
  - Mini programs: Save to device using file system API
- **File naming**: `{title}_{date}.html`

#### Scenario: Exporting note as HTML

- **WHEN** user taps export button
- **THEN** system SHALL generate self-contained HTML
- **AND** system SHALL trigger download with filename `{title}_{date}.html`
- **AND** system SHALL show success message

### Requirement: User Annotations Persistence

The system SHALL automatically save user annotations:

- **Auto-save interval**: Every 3 seconds after changes
- **Storage key**: `ai_note_user_notes_{noteId}`
- **Restore on load**: Load user notes when opening note detail
- **Conflict handling**: Last write wins (simple approach)

#### Scenario: Auto-saving annotations

- **WHEN** user types in the notes tab
- **THEN** system SHALL debounce input (3 second delay)
- **AND** system SHALL save to localStorage
- **AND** system SHALL update saved indicator

### Requirement: Note Caching

The system SHALL implement caching for generated notes:

- **Cache strategy**: Store generated HTML in note data
- **Cache invalidation**: User can force regeneration
- **Benefits**: Instant loading on repeat visits

#### Scenario: Loading cached note

- **WHEN** user opens a previously generated note
- **THEN** system SHALL load HTML directly from storage
- **AND** system SHALL skip regeneration
- **AND** system SHALL display instantly

### Requirement: Storage Quota Management

The system SHALL handle storage quota limits:

- **Quota check**: Warn user when approaching limit
- **Quota exceeded**: Prompt user to delete old notes
- **Cleanup**: Provide batch delete option for old notes

#### Scenario: Storage quota warning

- **WHEN** storage usage exceeds 80% of quota
- **THEN** system SHALL show warning message
- **AND** system SHALL suggest deleting old notes
- **AND** system SHALL provide quick delete option

### Requirement: Data Backup (Future)

The system SHALL eventually support data backup:

- **Export format**: JSON file with all notes
- **Import**: Restore from backup file
- **Note**: This is a future enhancement, not in v1.0

#### Scenario: Exporting all notes

- **WHEN** user requests backup in settings
- **THEN** system SHALL export all notes as JSON
- **AND** system SHALL download backup file
- **AND** system SHALL show success message

### Requirement: Quick Note Creation

The system SHALL provide quick access to create notes:

- **Home page button**: Prominent "Create Note" CTA
- **Floating action button**: Optional FAB on list page
- **Keyboard shortcut**: Cmd/Ctrl + N on desktop H5

#### Scenario: Quick note creation flow

- **WHEN** user taps "Create Note" on home page
- **THEN** system SHALL navigate to create page
- **AND** system SHALL show URL/text input form
