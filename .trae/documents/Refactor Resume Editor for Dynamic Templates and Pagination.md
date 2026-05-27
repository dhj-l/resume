I will refactor the resume editor architecture to support dynamic template switching and basic pagination logic.

### 1. Architecture Refactoring for Template Switching

*   **Create Template Directory**: Create `src/views/editor/templates` to house all resume templates.
*   **Extract Default Template**: Move the current layout logic from `ResumePreview.vue` to a new component `src/views/editor/templates/TemplateDefault.vue`.
*   **Template Registry**: Create `src/views/editor/templates/index.ts` to export a map of available templates (e.g., `{ default: TemplateDefault }`).
*   **Update Store**: Modify `src/stores/resumeStore.ts` to add `selectedTemplate` state and an action to change it.

### 2. Component Updates

*   **Update `ResumePreview.vue`**:
    *   Refactor it to be a **container component**.
    *   Use Vue's `<component :is="...">` to dynamically render the selected template from the store.
    *   Pass `resumeData` as props to the dynamic template.
*   **Update `EditorHeader.vue`**:
    *   Connect the template dropdown to the `resumeStore` to trigger template switching.

### 3. Pagination Implementation (CSS-First Approach)

*   **Print Styles**: Add global print styles in `src/assets/main.css` (or a new `print.css`) to handle A4 sizing and margins during printing/PDF export.
*   **Break Avoidance**: Add `.resume-section { break-inside: avoid; }` to ensure resume modules (like "Education") are not split across pages when printing.
*   **Preview Container**: Ensure the `ResumePreview` container visually simulates an A4 page (min-height 297mm) to give users a WYSIWYG experience.

### 4. Future Scalability

*   This architecture allows adding new templates by simply creating a `.vue` file in `templates/` and registering it in `index.ts`, satisfying the requirement for "continuous addition of templates".

I will start by creating the template directory and extracting the current layout.
