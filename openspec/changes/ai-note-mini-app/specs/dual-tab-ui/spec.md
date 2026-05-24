## ADDED Requirements

### Requirement: Dual-Tab Navigation

The system SHALL provide fixed bottom tab navigation with three tabs:

- **文字笔记 (Text Tab)**: Displays detailed text content with full explanations
- **图解 (Diagram Tab)**: Displays visual summaries with charts and diagrams
- **随手记 (Notes Tab)**: User-editable rich text area for personal annotations

#### Scenario: Tab switching behavior

- **WHEN** user taps a tab button
- **THEN** system SHALL switch to the corresponding tab content
- **AND** system SHALL update the tab indicator (highlighted state)
- **AND** system SHALL maintain smooth transition animation (300ms ease)

#### Scenario: Tab state persistence

- **WHEN** user switches between tabs
- **THEN** system SHALL remember the last active tab
- **AND** system SHALL restore tab state when reopening the note

### Requirement: Note Header Component

The system SHALL display a fixed header with gradient background:

- **Layout**: Tag pill, title, subtitle from top to bottom
- **Gradient**: Linear gradient from `#667eea` to `#764ba2`
- **Shape**: Rounded corners (16px radius)
- **Content**:
  - Tag pill: Inline badge with semi-transparent background
  - Title: Large text (1.4rem), bold font
  - Subtitle: Smaller text (0.85rem), slightly transparent

#### Scenario: Header rendering

- **WHEN** note data contains tag, title, and subtitle
- **THEN** system SHALL render header with gradient background
- **AND** system SHALL display tag as a pill badge
- **AND** system SHALL show title and subtitle with appropriate hierarchy

### Requirement: Text Tab Content Layout

The text tab SHALL display content using these components:

- **Allowed components**:
  - Headers: `h2`, `h3` for section titles
  - Paragraphs: `p` for body text
  - Lists: `ul`, `ol` for itemized content
  - Block quotes: `blockquote` for citations
  - Code blocks: `pre` > `code` for code samples
  - Tables: `table` for tabular data
  - Highlight boxes: `.highlight-box` with colored left border
  - Tag pills: `.tag-*` with rounded colored badges
  - Footer tags: `.footer-tags` at the bottom

- **Forbidden components**:
  - Card-style components (concept cards, grid cards, etc.)
  - Complex grid layouts

#### Scenario: Text content rendering

- **WHEN** text content contains mixed elements (headers, lists, quotes)
- **THEN** system SHALL render all elements with appropriate styling
- **AND** system SHALL ensure readable line height (1.7)
- **AND** system SHALL apply consistent spacing between elements

### Requirement: Diagram Tab Content Layout

The diagram tab SHALL support 6 visualization patterns:

#### Pattern 1: Mermaid Flowchart

- **Usage**: Complex architecture, multi-branch flows (>4 nodes)
- **Layout options**:
  - `flowchart LR`: Horizontal layout (default for ≤6 nodes)
  - `flowchart TB`: Vertical layout (fallback for >8 nodes or complex branches)
- **Styling**: Mermaid renders as SVG with consistent theme

#### Pattern 2: Three-Column Cards (No Icons)

- **Usage**: 3 parallel concepts or solutions
- **Structure**:
  - Grid container: `display: grid; grid-template-columns: 1fr 1fr 1fr`
  - Card elements: label, title, description
- **Effect bar**: Optional bottom bar showing results/metrics

#### Pattern 3: Three-Column Cards (With Icons)

- **Usage**: 3 methods/products requiring visual distinction
- **Structure**:
  - Large emoji icon as visual anchor
  - Title, subtitle, description
  - Info bar with key parameters
  - Effect bar with metrics

#### Pattern 4: Vertical Steps

- **Usage**: Sequential processes (1→2→3)
- **Structure**:
  - Step list with numbered circles
  - Color progression: blue → purple → orange
  - Optional routing/decision bar at bottom

#### Pattern 5: CSS Flow Nodes

- **Usage**: Simple linear processes (≤4 nodes, no branches)
- **Structure**:
  - Horizontal flow row
  - Nodes with rounded backgrounds
  - Arrow connectors between nodes
- **Benefits**: Zero dependencies, no Mermaid syntax errors

#### Pattern 6: Two-Column Grid + Tags

- **Usage**: Multi-dimensional information grouping
- **Structure**:
  - Grid of tag cards
  - Each card: title + tag pills
  - Tag colors: blue (function), purple (technical), green (performance), orange (monitoring)

#### Pattern 7: CSS Tree

- **Usage**: Hierarchical classification or decision trees
- **Structure**:
  - Indented layout with connecting lines
  - Expandable/collapsible nodes
  - Visual tree structure using CSS borders

#### Scenario: Diagram pattern selection

- **WHEN** rendering diagram content
- **THEN** system SHALL analyze content type
- **AND** system SHALL select the most appropriate pattern
- **AND** system SHALL wrap each diagram in `diagram-section` container

### Requirement: Notes Tab (User Annotations)

The system SHALL provide a simple rich text editor:

- **Editable area**: Contenteditable div with rich text support
- **Formatting support**:
  - Bold text
  - Italic text
  - Headers (h2, h3)
  - Bullet lists
  - Numbered lists
- **Persistence**: Auto-save to localStorage with note title as key
- **Styling**: Clean, minimal design matching the overall theme

#### Scenario: User editing annotations

- **WHEN** user types in the notes tab
- **THEN** system SHALL apply formatting as user types
- **AND** system SHALL auto-save to localStorage every 3 seconds
- **AND** system SHALL restore content when reopening the note

### Requirement: Responsive Design

The UI SHALL adapt to different screen sizes:

- **Mobile**: Full-width with appropriate padding
- **Tablet**: Centered container with max-width 860px
- **Desktop**: Centered container with max-width 860px, comfortable reading width
- **Tab bar**: Fixed at bottom, safe area aware for notched devices

#### Scenario: Responsive layout on mobile

- **WHEN** user views note on mobile device
- **THEN** system SHALL use full available width
- **AND** system SHALL ensure tab bar is easily tappable (min 44px touch target)
- **AND** system SHALL handle safe areas (iPhone notch, home indicator)

### Requirement: Visual Consistency

All UI components SHALL maintain visual consistency:

- **Color palette**:
  - Primary: Blue-purple gradient (`#667eea` → `#764ba2`)
  - Text: Dark blue-gray (`#1a2332`)
  - Background: Light gray (`#f0f2f5`)
  - Accents: Blue, purple, orange, green for tags
- **Typography**: System fonts (SF Pro, PingFang, Helvetica Neue, Arial)
- **Spacing**: Consistent padding (20px, 24px), margins, and gaps
- **Borders**: Rounded corners (16px for cards, 50% for circles)
- **Shadows**: Soft box shadows for depth (`rgba(0,0,0,0.08)`)

#### Scenario: Consistent styling across components

- **WHEN** rendering different element types
- **THEN** system SHALL apply consistent color palette
- **AND** system SHALL use consistent spacing scale
- **AND** system SHALL maintain visual hierarchy through font sizes
