# ResumeCard 组件抽取 Spec

## Why
当前“我的简历”列表页直接内联渲染卡片 DOM，结构较长且复用性差；抽取为 `ResumeCard` 便于维护与样式一致性，并复用 `TemplateCard` 的卡片风格交互。

## What Changes
- 新增 `ResumeCard.vue`，用于展示单个简历条目（封面/标题/更新时间/模板标记/操作按钮）。
- `MyResumes.vue` 中将原本内联的卡片渲染替换为 `ResumeCard`。
- `ResumeCard` 的数据输入类型使用 `UserResumeListItem`（`src/api/resume/type.ts`）。

## Impact
- Affected specs: 用户简历列表展示、卡片组件化、编辑/删除交互
- Affected code:
  - `src/views/user/MyResumes.vue`
  - `src/views/user/components/ResumeCard.vue`（新增）
  - `src/api/resume/type.ts`（仅类型引用，不改动）

## ADDED Requirements
### Requirement: ResumeCard 组件
系统 SHALL 提供一个 `ResumeCard` 组件，用于展示个人简历列表中的单个卡片。

#### Props
- `resume: UserResumeListItem`：简历数据。
- `editLoading?: boolean`：编辑按钮 loading。
- `deleteLoading?: boolean`：删除按钮 loading。

#### Emits
- `edit(id: string)`：用户点击编辑按钮时触发。
- `delete(payload: { id: string; title: string })`：用户点击删除按钮时触发。

#### UI/交互
- **WHEN** `resume.cover` 存在
  - **THEN** 在卡片顶部展示封面图片（参考 `TemplateCard` 的图片区风格，支持 hover 放大/遮罩交互）。
- **WHEN** `resume.cover` 不存在
  - **THEN** 展示占位内容（与现有风格保持一致）。
- **WHEN** `resume.isTemplate` 为 true
  - **THEN** 展示 “模板” 标签。
- **WHEN** 用户点击“编辑”
  - **THEN** 触发 `edit(resume._id)`。
- **WHEN** 用户点击“删除”
  - **THEN** 触发 `delete({ id: resume._id, title: resume.title })`。

## MODIFIED Requirements
### Requirement: 我的简历列表页卡片渲染
系统 SHALL 在 `MyResumes.vue` 中使用 `ResumeCard` 渲染每个简历条目，并保持现有的编辑/删除业务逻辑与 loading 表现不变。

## REMOVED Requirements
无

