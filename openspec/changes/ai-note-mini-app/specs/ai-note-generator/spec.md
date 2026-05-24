## ADDED Requirements

### Requirement: Content Fetching and Parsing

The system SHALL support fetching content from the following sources:

- **URL links**: The system SHALL use platform-specific HTTP clients to fetch web page content
- **Plain text**: The system SHALL accept user-provided text content directly
- **Audio/Video**: The system SHALL search for related summaries or accept user-provided descriptions

#### Scenario: Fetching content from URL

- **WHEN** user provides a valid URL
- **THEN** system SHALL fetch the HTML content from the URL
- **AND** system SHALL extract the main text content using content extraction logic
- **AND** system SHALL handle extraction failures gracefully with error messages

#### Scenario: User provides plain text

- **WHEN** user provides plain text content
- **THEN** system SHALL use the text directly as input
- **AND** system SHALL skip URL fetching step

#### Scenario: Invalid URL handling

- **WHEN** user provides an invalid or unreachable URL
- **THEN** system SHALL display an error message
- **AND** system SHALL allow user to retry or provide text instead

### Requirement: AI-Powered Note Generation

The system SHALL generate dual-tab notes using AI analysis:

- The system SHALL send the fetched content to the AI API via cloud functions
- The AI response SHALL be parsed into structured JSON containing:
  - `title`: Short note title
  - `subtitle`: Subtitle or supplementary description
  - `tag`: Classification tag
  - `source`: Original URL (empty string if no URL)
  - `text_content`: Complete HTML for the text tab
  - `diagram_content`: Complete HTML for the diagram tab

#### Scenario: Successful AI generation

- **WHEN** user submits content for generation
- **AND** the AI API returns valid JSON
- **THEN** system SHALL parse the response into structured data
- **AND** system SHALL render the dual-tab note UI
- **AND** system SHALL save the note to local storage

#### Scenario: AI API failure

- **WHEN** AI API call fails or returns invalid data
- **THEN** system SHALL display a user-friendly error message
- **AND** system SHALL allow user to retry
- **AND** system SHALL log the error for debugging

### Requirement: Knowledge Point Extraction

The AI SHALL extract 3-8 core knowledge points from the content:

- The system SHALL identify key concepts and their relationships
- The system SHALL organize knowledge points in logical order
- The text content SHALL use markdown-like formatting (headers, lists, quotes, highlights)
- The diagram content SHALL use appropriate visualization patterns

#### Scenario: Extracting knowledge points from article

- **WHEN** AI processes an article about "RAG Systems"
- **THEN** system SHALL extract knowledge points like "Embedding", "Vector Search", "Hybrid Retrieval"
- **AND** system SHALL map each point to appropriate tab (text vs diagram)

### Requirement: Layout Pattern Selection

The system SHALL automatically select appropriate layout patterns:

- **Mermaid Flowchart (LR/TB)**: For complex architecture and multi-branch flows (>4 nodes)
- **CSS Flow Nodes**: For simple linear processes (≤4 nodes, no branches)
- **Three-Column Cards**: For parallel concepts or 3-way comparisons
- **Vertical Steps**: For sequential processes (1→2→3)
- **Two-Column Grid + Tags**: For multi-dimensional information grouping
- **CSS Tree**: For hierarchical classification or decision trees

#### Scenario: Automatic pattern selection

- **WHEN** AI generates diagram content
- **THEN** system SHALL analyze content characteristics
- **AND** system SHALL select the most appropriate visualization pattern
- **AND** system SHALL wrap each diagram module in `diagram-section` container

### Requirement: Mermaid Diagram Rendering

The system SHALL render Mermaid diagrams with proper error handling:

- **H5 platform**: Load Mermaid.js from CDN (`mermaid@11`)
- **Mini-program platforms**: Use bundled local Mermaid.js
- **Error handling**: Display fallback text when Mermaid fails to render
- **Syntax validation**: Validate Mermaid syntax before rendering

#### Scenario: Successful Mermaid rendering

- **WHEN** Mermaid code is valid
- **THEN** system SHALL render the diagram as SVG
- **AND** system SHALL apply consistent styling

#### Scenario: Mermaid rendering failure

- **WHEN** Mermaid code contains syntax errors
- **THEN** system SHALL display the raw Mermaid code in a code block
- **AND** system SHALL show a warning icon
- **AND** system SHALL suggest checking the text tab for complete content

### Requirement: HTML Assembly

The system SHALL assemble final HTML from template:

- The system SHALL read the base template HTML
- The system SHALL replace placeholders: `<!-- NOTE_TITLE -->`, `<!-- TEXT_CONTENT -->`, `<!-- DIAGRAM_CONTENT -->`, etc.
- The output SHALL be a complete, self-contained HTML file
- The HTML SHALL include all necessary CSS styles inline

#### Scenario: HTML assembly process

- **WHEN** all content data is ready
- **THEN** system SHALL load the base template
- **AND** system SHALL replace all placeholders with actual content
- **AND** system SHALL generate final HTML ready for display
