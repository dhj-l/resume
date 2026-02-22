# 修复 v-html 内容行高样式继承问题 Spec (v2)

## Why

之前的修复方案不完整。问题有两个层面：

1. `ResumePreview.vue` 的 `.resume-preview-wrapper` 本身没有设置行高，导致 `ul/ol/li` 的 `inherit` 无法继承任何值
2. 各个 Section 组件的 `description` 样式使用了 `leading-relaxed` Tailwind 类（等于 `line-height: 1.625`），这会覆盖从父元素继承的行高

## What Changes

- 在 `ResumePreview.vue` 中为 `.resume-preview-wrapper` 添加行高绑定
- 移除各个 Section 组件中 `description` 样式的 `leading-relaxed` 类，让行高能够正确继承

## Impact

- Affected specs: 全局样式设置功能、PDF 导出功能
- Affected code:
  - `d:\ai-msw\test\ai-resume\src\views\editor\components\ResumePreview.vue`
  - `d:\ai-msw\test\ai-resume\src\views\editor\components\preview\ProjectExperienceSection.ts`
  - `d:\ai-msw\test\ai-resume\src\views\editor\components\preview\InternshipExperienceSection.ts`
  - `d:\ai-msw\test\ai-resume\src\views\editor\components\preview\WorkExperienceSection.ts`
  - `d:\ai-msw\test\ai-resume\src\views\editor\components\preview\CampusExperienceSection.ts`
  - `d:\ai-msw\test\ai-resume\src\views\editor\components\preview\SelfEvaluationSection.ts`

## Root Cause Analysis

### 问题链路分析

1. **全局行高设置流程**：
   - `GlobalStyleSettings.vue` → `setGlobalStyle({ lineHeight: \`${val}\` })`
   - 存储在 `resumeStore.globalStyle.lineHeight`

2. **行高应用位置**：
   - 模板组件（`default-template.vue` 等）在 `.resume-page` 上设置 `:style="{ lineHeight: globalLineHeight }"`
   - 但 `ResumePreview.vue` 的 `.resume-preview-wrapper` 没有设置行高

3. **样式覆盖问题**：
   - 各 Section 组件的 `description` 样式包含 `leading-relaxed`
   - `leading-relaxed` = `line-height: 1.625`，会覆盖继承的行高
   - `v-html` 渲染的内容位于带有 `leading-relaxed` 类的元素内

### 继承链断裂点

```
模板组件 .resume-page (lineHeight: globalLineHeight)
    ↓
ResumePreview.vue .resume-preview-wrapper (无行高设置) ← 断裂点1
    ↓
Section 组件 .description (leading-relaxed = 1.625) ← 断裂点2
    ↓
v-html 内容 ul/ol/li (inherit 无效)
```

## ADDED Requirements

### Requirement: 行高继承链完整性

系统 SHALL 确保全局行高设置能够沿着完整的继承链传递到 `v-html` 渲染的内容。

#### Scenario: 用户修改行高设置

- **WHEN** 用户在全局样式设置中修改行高值
- **THEN** 行高应沿着 `.resume-page` → `.resume-preview-wrapper` → Section 组件 → `v-html` 内容的链路正确传递

## MODIFIED Requirements

### Requirement: ResumePreview.vue 行高绑定

`ResumePreview.vue` 的 `.resume-preview-wrapper` SHALL 绑定全局行高：

**修改前**：

```vue
<div class="resume-preview-wrapper" ref="currentTemplateRef">
```

**修改后**：

```vue
<div class="resume-preview-wrapper" ref="currentTemplateRef" :style="{ lineHeight: globalLineHeight }">
```

### Requirement: Section 组件样式定义

各 Section 组件的 `description` 样式 SHALL 移除 `leading-relaxed` 类：

**修改前**：

```typescript
description: "text-gray-600 leading-relaxed whitespace-pre-wrap",
```

**修改后**：

```typescript
description: "text-gray-600 whitespace-pre-wrap",
```

### 受影响的文件列表

1. `ProjectExperienceSection.ts` - 第 29 行
2. `InternshipExperienceSection.ts` - 第 29 行
3. `WorkExperienceSection.ts` - 第 29 行
4. `CampusExperienceSection.ts` - 第 29 行
5. `SelfEvaluationSection.ts` - 第 17 行和第 27 行
