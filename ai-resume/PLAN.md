# AI 简历项目规划文档

本文档基于 `src` 目录结构及 `API_DOCS.md` 接口文档分析生成，旨在梳理当前项目进度，规划后续开发任务。

## 1. 项目现状分析

### 1.1 已实现模块

- **用户认证 (Auth)**
  - 登录页 (`/auth/login`)
  - 注册页 (`/auth/register`)
  - 基础 API 封装 (`api/auth`)
  - Pinia Store (`stores/auth`)
- **简历编辑器 (Editor)**
  - 基础布局 (`views/editor/EditorPage.vue`)
  - 头部导航 (`EditorHeader`)
  - 实时预览 (`ResumePreview`)
  - 编辑抽屉 (`EditDrawer`)
  - PDF 下载功能 (已集成)
- **模板市场 (Template)**
  - 模板列表页 (`/templates`)
  - 模板详情页 (`/templates/:id`)
  - 基础 API 封装 (`api/templates`)

### 1.2 缺失或待完善模块

- **用户中心 (User)**
  - **缺失**：个人中心页（展示用户信息）。
  - **缺失**：我的简历列表页（管理已创建的简历）。
  - **API**：缺失 `updateUserInfo`（修改信息）、`changePassword`（修改密码）的前端对接。
- **简历管理 (Resume)**
  - **缺陷**：编辑器页面 (`EditorPage.vue`) 目前强依赖 Pinia 状态，刷新页面可能丢失数据。未根据 URL 参数 `id` 加载简历。
  - **API**：缺失 `getUserResumes`（获取用户所有简历列表）、`deleteResume`（删除简历）的封装。
- **路由 (Router)**
  - **缺失**：404 页面。
  - **缺失**：路由守卫虽有，但未覆盖所有需要保护的页面（如简历列表）。

---

## 2. API 对接清单

| 模块         | 接口名称     | 方法   | 路径                      | 状态      | 说明                     |
| :----------- | :----------- | :----- | :------------------------ | :-------- | :----------------------- |
| **User**     | 注册         | POST   | `/api/v1/user`            | ✅ 已完成 |                          |
|              | 登录         | POST   | `/api/v1/user/login`      | ✅ 已完成 |                          |
|              | 获取用户信息 | GET    | `/api/v1/user/:id`        | ⏳ 待对接 | 需在个人中心使用         |
|              | 更新用户信息 | PATCH  | `/api/v1/user/:id`        | ⏳ 待对接 |                          |
| **Resume**   | 创建简历     | POST   | `/api/v1/resume`          | ✅ 已完成 |                          |
|              | 获取所有简历 | GET    | `/api/v1/resume`          | ❌ 未封装 | 用于“我的简历”列表       |
|              | 获取单个简历 | GET    | `/api/v1/resume/:id`      | ✅ 已完成 |                          |
|              | 更新简历     | PATCH  | `/api/v1/resume/:id`      | ✅ 已完成 |                          |
|              | 删除简历     | DELETE | `/api/v1/resume/:id`      | ❌ 未封装 |                          |
|              | 下载 PDF     | POST   | `/api/v1/resume/download` | ✅ 已完成 |                          |
| **Template** | 获取模板列表 | GET    | `/api/v1/template`        | ✅ 已完成 |                          |
|              | 获取模板详情 | GET    | `/api/v1/template/:id`    | ✅ 已完成 |                          |
| **Upload**   | 上传图片     | POST   | `/api/v1/upload/image`    | ⏳ 待确认 | 需确认编辑器中是否已集成 |

---

## 3. 待办事项 (To-Do List)

### 🚀 Phase 1: 核心功能闭环 (High Priority)

- [ ] **完善 API 封装** (`src/api/resume/resume.ts`)
  - [ ] 添加 `getUserResumesAPI`：获取当前用户所有简历。
  - [ ] 添加 `deleteResumeAPI`：删除指定简历。
- [ ] **实现“我的简历”列表页**
  - [ ] 创建 `src/views/user/MyResumes.vue`。
  - [ ] 展示简历卡片列表（包含标题、修改时间、操作按钮）。
  - [ ] 实现跳转编辑、删除简历功能。
  - [ ] 配置路由 `/user/resumes`。
- [ ] **优化编辑器初始化逻辑**
  - [ ] 修改路由配置，支持 `/editor/:id` 参数。
  - [ ] 在 `EditorPage.vue` 中添加 `onMounted` 逻辑：
    - 若 URL 包含 `id`，调用 `getResumeDetailAPI` 加载数据并更新 Store。
    - 若无 `id`，重置 Store 为初始状态（新建模式）。

### 🛠 Phase 2: 用户体验提升 (Medium Priority)

- [ ] **实现个人中心页**
  - [ ] 创建 `src/views/user/UserProfile.vue`。
  - [ ] 展示用户基本信息（头像、昵称、邮箱）。
  - [ ] (可选) 支持修改基本信息。
- [ ] **完善模板使用流程**
  - [ ] 在模板详情页添加“使用此模板”按钮。
  - [ ] 点击后调用 `createResumeAPI`（传入模板 ID），创建成功后跳转至编辑器。
- [ ] **图片上传集成**
  - [ ] 确保编辑器中的头像上传功能已对接 `/api/v1/upload/image`。

### 🎨 Phase 3: 细节优化 (Low Priority)

- [ ] **全局 UI 优化**
  - [ ] 添加全局 Loading 状态（页面跳转、API 请求时）。
  - [ ] 统一错误提示（使用 Ant Design Message 组件）。
- [ ] **404 页面**
  - [ ] 创建 `src/views/error/NotFound.vue`。
  - [ ] 配置通配符路由跳转。
- [ ] **代码重构**
  - [ ] 清理 `src/api/resume/resume.ts` 中重复的接口定义（如 `getResumeInfoAPI` 和 `getResumeDetailAPI`）。
  - [ ] 完善 TypeScript 类型定义（如 API 响应数据的类型）。

---

## 4. 目录结构建议 (Proposed Structure)

建议在 `src/views` 下新增 `user` 目录，用于存放用户相关页面：

```
src/views/
├── auth/           # 认证相关
├── editor/         # 编辑器核心
├── home/           # 首页及落地页
├── template/       # 模板相关
└── user/           # [新增] 用户中心
    ├── MyResumes.vue   # 我的简历列表
    └── UserProfile.vue # 个人资料
```
