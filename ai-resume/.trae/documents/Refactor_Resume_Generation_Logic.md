# Plan: Refactor Resume Generation Logic to use AI API

## Objective
Modify `TemplateDetailsPage.vue` and related dialogs to replace the current resume creation logic with the new AI Resume Generation API (`/api/v1/resume-ai/generate`). Ensure the dialogs support loading states and error handling as requested.

## Tasks

### 1. API Definition
- **File**: `d:\ai-msw\test\ai-resume\src\api\resume\resume.ts`
- **Action**: Add `generateAiResumeAPI` function.
- **Details**:
  - Endpoint: `/api/v1/resume-ai/generate`
  - Method: `POST`
  - Response Type: `ApiResponse<{ _id: string }>` (strictly extract `_id`).
  - Params Interface: `AiResumeParams` (parseType, jobDescription, templateType, etc.).

### 2. Update SelectResumeDialog Component
- **File**: `d:\ai-msw\test\ai-resume\src\views\template\components\SelectResumeDialog.vue`
- **Action**: Add `submitting` prop to control the loading state of the "Confirm" button.
- **Details**:
  - Add prop: `submitting: boolean`.
  - Bind `:loading="submitting || loading"` to the Confirm button.
  - Ensure the dialog remains open during submission (controlled by parent).

### 3. Update UploadResumeDialog Component
- **File**: `d:\ai-msw\test\ai-resume\src\views\template\components\UploadResumeDialog.vue`
- **Action**: Add `submitting` prop.
- **Details**:
  - Add prop: `submitting: boolean`.
  - Update Confirm button to use `:loading="loading || submitting"`.

### 4. Refactor TemplateDetailsPage Logic
- **File**: `d:\ai-msw\test\ai-resume\src\views\template\TemplateDetailsPage.vue`
- **Action**: Update submit handlers to call `generateAiResumeAPI` and manage dialog visibility/loading states.
- **Details**:
  - **`handleAiSubmit` (Manual)**:
    - Map payload: `parseType: 'manual'`, `jobDescription: data.jd`, `detailInfo: { ...data.userInfo, supplementary: data.supplementary }`.
    - Use `template.value.category` (or `resume.type`) as `templateType`.
    - Call API, handle `isAiCreating` loading.
    - Redirect to `/editor/:id` on success.
    - Keep dialog open on error.
  - **`handleSelectResumeSubmit` (Select)**:
    - Map payload: `parseType: 'select'`, `jobDescription: payload.jd`, `resumeId: payload.resumeId`.
    - Call API, handle `isImporting` loading.
    - Pass `isImporting` to `SelectResumeDialog` as `submitting`.
    - Redirect on success, keep open on error.
  - **`handleUploadResumeSubmit` (Upload)**:
    - Map payload: `parseType: 'upload'`, `jobDescription: payload.jdText`, `resumeContent: payload.resumeText`.
    - Call API, handle `isImporting` loading.
    - Pass `isImporting` to `UploadResumeDialog` as `submitting`.
    - Redirect on success, keep open on error.

## Verification Steps
1.  **Manual Flow**: Open "Manual", fill details, submit. Verify API call payload (`parseType: manual`) and redirect.
2.  **Select Flow**: Open "Select", choose resume, enter JD, submit. Verify API call payload (`parseType: select`) and redirect. Verify button loading state.
3.  **Upload Flow**: Open "Upload", upload file, enter JD, submit. Verify API call payload (`parseType: upload`) and redirect. Verify button loading state.
4.  **Error Handling**: Simulate network error (offline or mock failure). Verify dialog stays open, loading stops, and error message appears.
