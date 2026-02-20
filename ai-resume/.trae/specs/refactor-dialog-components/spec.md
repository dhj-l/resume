# Refactor Dialog Components Spec

## Why
Simplify the codebase and reduce dependencies by removing complex logic and non-standard component libraries from the dialog components. This aligns with the user's request to use only Ant Design Vue components and keep the logic minimal.

## What Changes
- **CreateModeDialog.vue**: 
  - Remove `lucide-vue-next` icons and replace with `@ant-design/icons-vue`.
  - Simplify the component logic to only handle basic open/close and mode selection emits.
  - Remove any complex internal state or processing.
- **SelectResumeDialog.vue**:
  - Remove `lucide-vue-next` icons and replace with `@ant-design/icons-vue`.
  - Remove API calls (`getUserResumesAPI`) and data fetching logic.
  - Simplify the component to display a static or placeholder list structure, or remove the list rendering logic if data is not available.
  - Keep Props `open` and Emits `update:open`, `submit`, `create-new` for basic interaction.
- **UploadResumeDialog.vue**:
  - Remove `lucide-vue-next` icons and replace with `@ant-design/icons-vue`.
  - Remove file validation, processing, and mock upload simulation logic.
  - Simplify the component to display the upload UI structure only.
  - Keep Props `open` and Emits `update:open`, `submit` for basic interaction.

## Impact
- **Affected Specs**: None directly, but this simplifies the UI components used in the resume creation flow.
- **Affected Code**:
  - `src/views/template/components/CreateModeDialog.vue`
  - `src/views/template/components/SelectResumeDialog.vue`
  - `src/views/template/components/UploadResumeDialog.vue`
- **Dependencies**: Removed dependency on `lucide-vue-next` in these files. Added dependency on `@ant-design/icons-vue` (assumed to be available as part of Ant Design Vue usage).

## ADDED Requirements
### Requirement: UI Standardization
The system SHALL use `@ant-design/icons-vue` for all icons in the specified dialog components.

### Requirement: Logic Simplification
The specified dialog components SHALL NOT contain complex business logic (API calls, data processing, file handling). They SHALL only handle basic UI state (open/close) and event emission.

## MODIFIED Requirements
### Requirement: Dialog Functionality
The dialogs will now serve as purely presentational components with minimal internal logic, relying on the parent component or future implementation for data and complex interactions.

## REMOVED Requirements
### Requirement: Data Fetching and File Processing
**Reason**: User request to remove logic.
**Migration**: Logic is removed; future implementation will need to re-introduce necessary logic or handle it in the parent component.
