# Refactor Resume Components Styles

This plan addresses the requirement to remove hardcoded `margin`, `padding`, and `font-size` styles from the resume preview components and rely on the global configuration from `resumeStore`.

## 1. Refactor Preview Component Styles (`src/views/editor/components/preview/*.ts`)

I will iterate through all style definition files in the `preview` directory and remove hardcoded spacing and base font sizes.

### Target Files:
- `BasicInfoSection.ts`
- `JobIntentionSection.ts`
- `EducationBackgroundSection.ts`
- `WorkExperienceSection.ts`
- `ProjectExperienceSection.ts`
- `SkillsSection.ts`
- `CertificatesSection.ts`
- `SelfEvaluationSection.ts`

### Changes per file:
- **Container**: Remove `p-*` (padding) and `m-*` (margin) classes. The outer template handles module margins and page padding.
- **Content**: Remove `text-sm`, `text-base` classes to allow inheriting the global `fontSize`.
- **Titles/Headers**: Retain `text-lg`, `text-xl`, `text-2xl`, `font-bold` to maintain visual hierarchy (necessary styles).
- **Internal Layout**: Retain `gap-*`, `flex`, `grid` classes as these are necessary for internal component layout.

## 2. Verify Template Configuration (`src/views/editor/templates/template-list/*`)

Ensure the templates correctly inject the global styles into the container and module wrappers.

### Target Files:
- `default-template/default-template.vue`
- `double-column-template/double-column-template.vue`

### Verification Points:
- **Page Container**: Must apply `padding`, `fontSize`, `lineHeight` from `resumeData.globalStyle`.
- **Module Wrapper**: Must apply `moduleMargin` (as `marginBottom` or `gap`) from `resumeData.globalStyle`.
- **Cleanup**: Remove any conflicting hardcoded styles on the wrapper elements if found.

## 3. Execution Strategy

1.  **Read & Update**: I will process the `.ts` style files in batches, applying the cleaning rules.
2.  **Verify**: I will verify the `.vue` template files to ensure they are clean and correctly binding the store values.
