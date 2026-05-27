# AI Resume Creation Plan

## Objective
Add an "AI Create Resume" feature to the `TemplateDetailsPage` which allows users to input job descriptions and personal details via a multi-step dialog. This data will be used to generate a tailored resume (mocked or prepared for API).

## Implementation Steps

### 1. Create `AiCreateDialog` Component
**Location**: `src/views/template/components/AiCreateDialog.vue`

**Features**:
- **UI Framework**: Use Ant Design Vue (`a-modal`, `a-steps`, `a-form`, `a-input`, `a-select`, `a-textarea`).
- **State Management**:
  - `currentStep`: Tracks the progress (JD -> Basic Info -> Supplementary).
  - `formData`: Stores all user inputs.
- **Steps**:
  1.  **Job Description (JD)**:
      - Textarea for pasting JD.
      - Extensible slot for future file upload parsing.
  2.  **User Information**:
      - Form fields: Name, Education (Degree, School, Major), Age/Birth Year, Target Role, Experience Years.
  3.  **Supplementary Information**:
      - Textarea for additional context (skills, projects, etc.).
- **Events**:
  - `cancel`: Close the dialog.
  - `submit`: Emit the collected data to the parent component.

### 2. Update `TemplateDetailsPage.vue`
**Location**: `src/views/template/TemplateDetailsPage.vue`

**Changes**:
- Import `AiCreateDialog`.
- Add a new "AI 帮我写" (AI Help Me Write) button in the actions area.
  - Style: Distinct from "Use Template" (e.g., gradient or icon).
- Implement `handleAiCreate` function:
  - Open the dialog.
  - On submit, call `createResumeAPI` with `templateId` and the collected `aiContext`.
  - Redirect to the editor with the new resume ID.

### 3. Data Structure Update
**Location**: `src/api/resume/type.ts` (Optional, as it already has `[key: string]: any`)

**Context Payload**:
```typescript
interface AiContext {
  jobDescription: string;
  userInfo: {
    name: string;
    age: number;
    education: string; // Degree
    school: string;
    major: string;
    targetRole: string;
    yearsOfExperience: number;
  };
  supplementaryInfo: string;
}
```

## Verification
- Verify the "AI 帮我写" button appears on the template details page.
- Verify the dialog opens and steps work correctly.
- Verify data is collected and passed to the parent on submit.
- Verify the API call includes the new data.
