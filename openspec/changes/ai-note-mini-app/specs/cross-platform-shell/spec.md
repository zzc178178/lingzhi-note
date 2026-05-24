## ADDED Requirements

### Requirement: Cross-Platform Framework

The system SHALL use Taro 3.x as the cross-platform framework:

- **UI library**: React with TypeScript
- **Target platforms**:
  - WeChat Mini Program
  - Alipay Mini Program
  - H5 (Mobile Web)
- **Build system**: Taro CLI with webpack/vite

#### Scenario: Project initialization

- **WHEN** developer initializes the project with Taro CLI
- **THEN** system SHALL create a standard Taro project structure
- **AND** system SHALL configure TypeScript support
- **AND** system SHALL set up platform-specific configurations

### Requirement: Unified Page Structure

The system SHALL implement the following page hierarchy:

```
pages/
├── index/          # Home page - Create note entry point
├── create/         # Create note - Input URL or text
├── note/[id]/      # Note detail - Dual-tab display
├── notes/          # Notes list - Manage generated notes
└── settings/       # Settings - Theme, export settings
```

#### Scenario: Page navigation

- **WHEN** user taps "Create Note" button on home page
- **THEN** system SHALL navigate to create page
- **AND** system SHALL provide back navigation to home

#### Scenario: Viewing a note

- **WHEN** user taps on a note in the list
- **THEN** system SHALL navigate to note detail page
- **AND** system SHALL pass note ID as route parameter

### Requirement: Theme System

The system SHALL support theme customization:

- **Light theme** (default):
  - Background: `#f0f2f5`
  - Text: `#1a2332`
  - Primary: Blue-purple gradient
- **Dark theme** (future):
  - Inverted colors for night mode
- **System preference**: Auto-detect system theme setting

#### Scenario: Theme persistence

- **WHEN** user changes theme setting
- **THEN** system SHALL save preference to localStorage
- **AND** system SHALL apply theme on next app launch

### Requirement: Platform-Specific Adapters

The system SHALL provide adapters for platform-specific APIs:

- **Storage adapter**:
  - H5: `localStorage`
  - WeChat: `wx.getStorageSync()` / `wx.setStorageSync()`
  - Alipay: `my.getStorageSync()` / `my.setStorageSync()`
- **File system adapter**:
  - H5: FileSystem Access API or download attribute
  - WeChat: `wx.getFileSystemManager()`
  - Alipay: `my.saveFile()`
- **HTTP client adapter**:
  - H5: Fetch API
  - WeChat: `wx.request()`
  - Alipay: `my.request()`

#### Scenario: Platform detection and adaptation

- **WHEN** app launches on WeChat platform
- **THEN** system SHALL detect platform using Taro's platform detection
- **AND** system SHALL use WeChat-specific storage and HTTP APIs
- **AND** system SHALL handle platform-specific errors gracefully

### Requirement: Responsive Layout Container

The system SHALL implement a responsive container:

- **Max width**: 860px
- **Horizontal padding**: 16px (mobile), 20px (tablet+)
- **Vertical padding**: 20px top, 90px bottom (for fixed tab bar)
- **Auto-centering**: `margin: 0 auto`

#### Scenario: Container behavior across devices

- **WHEN** app runs on mobile phone (375px width)
- **THEN** container SHALL use full width with 16px padding
- **WHEN** app runs on tablet (768px width)
- **THEN** container SHALL center with max-width 860px

### Requirement: Navigation Bar

The system SHALL provide consistent navigation:

- **Platform-specific styling**:
  - H5: Custom header with gradient background
  - Mini programs: Native navigation bar with transparent option
- **Back button**: Platform-native back gesture and button
- **Title**: Dynamic title based on current page

#### Scenario: Navigation on H5

- **WHEN** user is on the create page in H5
- **THEN** system SHALL display custom header with back button
- **AND** system SHALL show page title "创建笔记"

### Requirement: Tab Bar Component

The system SHALL implement a fixed bottom tab bar:

- **Position**: Fixed at bottom, full width
- **Background**: Gradient fade from transparent to content background
- **Shadow**: Soft box shadow for elevation
- **Safe area**: Account for device safe areas (iPhone notch, home indicator)

#### Scenario: Tab bar on iPhone X

- **WHEN** app runs on iPhone X with home indicator
- **THEN** tab bar SHALL account for bottom safe area
- **AND** system SHALL use `env(safe-area-inset-bottom)` for padding

### Requirement: Error Boundary

The system SHALL implement error boundaries for graceful failure handling:

- **Page-level error boundary**: Catch rendering errors on each page
- **Component-level error boundary**: Catch errors in complex components
- **Fallback UI**: Display user-friendly error message with retry option

#### Scenario: Handling rendering errors

- **WHEN** a component throws an error during rendering
- **THEN** error boundary SHALL catch the error
- **AND** system SHALL display fallback UI
- **AND** system SHALL log error for debugging

### Requirement: Loading States

The system SHALL provide consistent loading indicators:

- **Button loading**: Disable button and show spinner during API calls
- **Page loading**: Full-page loading overlay for initial data fetch
- **Inline loading**: Small spinner for incremental operations
- **Skeleton screens**: Optional skeleton for content-heavy pages

#### Scenario: Loading during note generation

- **WHEN** user submits note for generation
- **THEN** system SHALL show full-page loading overlay
- **AND** system SHALL disable form inputs
- **AND** system SHALL show progress message

### Requirement: Network State Handling

The system SHALL handle various network conditions:

- **Offline mode**: Detect offline and show appropriate message
- **Slow network**: Show timeout after 30 seconds
- **API errors**: Display user-friendly error messages
- **Retry mechanism**: Provide manual retry option

#### Scenario: Network failure during content fetch

- **WHEN** network request fails due to connectivity
- **THEN** system SHALL display error message "网络连接失败"
- **AND** system SHALL show retry button
- **AND** system SHALL allow user to retry the operation
