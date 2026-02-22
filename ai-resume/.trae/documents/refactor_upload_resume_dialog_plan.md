# 重构 UploadResumeDialog 组件计划

本计划旨在重构 `src/views/template/components/UploadResumeDialog.vue` 组件，实现简历文件上传解析、内容编辑及 JD 输入功能，并优化用户体验与代码结构。

## 1. API 扩展
在 `src/api/resume/resume.ts` 中新增 `parseResumeAPI` 接口，用于上传简历文件并获取解析后的文本内容。

- **请求方式**: POST
- **路径**: `/resume/parse`
- **参数**: FormData (file)
- **返回**: `{ content: string }` (或其他包含解析文本的结构)

## 2. 组件重构 (`UploadResumeDialog.vue`)

### 2.1 Props & Emits 定义
- **Props**:
  - `open`: boolean (控制弹窗显示)
  - `resumeText`: string (简历解析文本，支持 v-model)
  - `jdText`: string (JD 文本，支持 v-model)
- **Emits**:
  - `update:open`: 更新弹窗状态
  - `update:resumeText`: 更新简历文本
  - `update:jdText`: 更新 JD 文本
  - `submit`: 提交最终数据 `{ resumeText, jdText }`

### 2.2 核心功能模块

#### A. 文件上传区域
- 使用 `a-upload-dragger` 组件。
- **限制**:
  - 类型: `.pdf, .doc, .docx`
  - 大小: ≤ 5MB
- **交互**:
  - 上传中禁用交互，显示 Loading 动画。
  - 上传成功后自动调用 `parseResumeAPI`。
  - 解析成功后，自动填充 `resumeText` 并聚焦对应文本框。
  - 解析失败显示错误提示，允许重试。

#### B. 简历文本编辑区域
- 新增 `a-textarea` 用于展示和编辑解析后的简历内容。
- **特性**:
  - 双向绑定 `resumeText`。
  - 显示字数统计。
  - 加载状态（骨架屏或 Spin）。
  - 错误提示。

#### C. JD 输入区域
- 新增独立的 `a-textarea` 用于输入 JD。
- **特性**:
  - 双向绑定 `jdText`。
  - 非空校验。
  - 字数统计。

#### D. 底部操作栏
- **取消**: 关闭弹窗。
- **确定**:
  - 校验 `resumeText` 和 `jdText` 是否为空。
  - 触发 `submit` 事件，传递 `{ resumeText, jdText }`。
  - 关闭弹窗（或由父组件控制）。

### 2.3 状态管理
- `loading`: 控制上传和解析过程的加载状态。
- `parsingError`: 存储解析失败的错误信息。
- `formState`: 内部维护的表单状态（如果未使用 v-model 传入，则使用内部状态）。

## 3. 样式与兼容性
- 使用 Tailwind CSS 保持现有 UI 风格。
- 确保在 Chrome, Edge, Firefox 等主流浏览器上的兼容性。
- 保持弹窗的响应式布局。

## 4. 步骤执行
1.  修改 `src/api/resume/resume.ts` 添加 `parseResumeAPI`。
2.  重构 `src/views/template/components/UploadResumeDialog.vue` 实现上述功能。
3.  验证组件功能（文件限制、上传解析、文本回填、双向绑定、校验提交）。
