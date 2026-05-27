# Tasks

- [x] Task 1: Refactor CreateModeDialog.vue
  - [x] Remove `lucide-vue-next` imports and usage.
  - [x] Import and use appropriate icons from `@ant-design/icons-vue` (e.g., `EditOutlined`, `CopyOutlined`, `CloudUploadOutlined`).
  - [x] Remove any unnecessary logic, keeping only Props and Emits definition.
- [x] Task 2: Refactor SelectResumeDialog.vue
  - [x] Remove `lucide-vue-next` imports and usage.
  - [x] Import and use appropriate icons from `@ant-design/icons-vue` (e.g., `FileTextOutlined`).
  - [x] Remove `getUserResumesAPI` import and usage.
  - [x] Remove `onMounted`, `watch`, and data fetching logic.
  - [x] Simplify the template to remove dynamic list rendering based on API data (or use a static placeholder if needed to keep structure).
  - [x] Keep Props and Emits definition.
- [x] Task 3: Refactor UploadResumeDialog.vue
  - [x] Remove `lucide-vue-next` imports and usage.
  - [x] Import and use appropriate icons from `@ant-design/icons-vue` (e.g., `CloudUploadOutlined`, `InfoCircleOutlined`).
  - [x] Remove file validation, drag-and-drop processing, and timeout simulation logic.
  - [x] Simplify the template to remove complex interactive bindings if they rely on removed logic.
  - [x] Keep Props and Emits definition.
