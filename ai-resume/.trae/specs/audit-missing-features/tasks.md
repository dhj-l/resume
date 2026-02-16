# 代做事项（对照 API_DOCS.md 的功能缺口清单）

> 目标：以“先补齐核心闭环，再扩展增强能力”的顺序推进；每项任务都能独立交付并可验证。  
> 范围：本清单以“前端（Vue3 + TS + Pinia + Router）”为主，按 `src/API_DOCS.md` 的接口与缺失模块来规划。

## 0. 覆盖度概览（当前已实现 vs 缺口）

### 0.1 已实现（前端已有代码支撑）

- [x] 用户注册：`POST /api/v1/user` → [auth.ts](file:///d:/ai-msw/test/ai-resume/src/api/auth/auth.ts)
- [x] 用户登录：`POST /api/v1/user/login` → [auth.ts](file:///d:/ai-msw/test/ai-resume/src/api/auth/auth.ts)
- [x] Token 注入、401 统一处理 → [request.ts](file:///d:/ai-msw/test/ai-resume/src/http/request.ts)
- [x] 模板列表：`GET /api/v1/template`（分页参数已支持；无分页 UI）→ [templates.ts](file:///d:/ai-msw/test/ai-resume/src/api/templates/templates.ts)、[TemplateListPage.vue](file:///d:/ai-msw/test/ai-resume/src/views/template/TemplateListPage.vue)
- [x] 模板详情：`GET /api/v1/template/:id` → [templates.ts](file:///d:/ai-msw/test/ai-resume/src/api/templates/templates.ts)、[TemplateDetailsPage.vue](file:///d:/ai-msw/test/ai-resume/src/views/template/TemplateDetailsPage.vue)
- [x] 发布模板：`POST /api/v1/template` → [templates.ts](file:///d:/ai-msw/test/ai-resume/src/api/templates/templates.ts)、[PublishTemplateModal.vue](file:///d:/ai-msw/test/ai-resume/src/views/editor/components/PublishTemplateModal.vue)
- [x] 创建简历：`POST /api/v1/resume`（支持 templateId）→ [resume.ts](file:///d:/ai-msw/test/ai-resume/src/api/resume/resume.ts)、[TemplateDetailsPage.vue](file:///d:/ai-msw/test/ai-resume/src/views/template/TemplateDetailsPage.vue)
- [x] 简历详情：`GET /api/v1/resume/:id` → [resume.ts](file:///d:/ai-msw/test/ai-resume/src/api/resume/resume.ts)
- [x] 更新简历：`PATCH /api/v1/resume/:id` → [resume.ts](file:///d:/ai-msw/test/ai-resume/src/api/resume/resume.ts)
- [x] 获取用户简历列表：`GET /api/v1/resume` → [resume.ts](file:///d:/ai-msw/test/ai-resume/src/api/resume/resume.ts)、[MyResumes.vue](file:///d:/ai-msw/test/ai-resume/src/views/user/MyResumes.vue)
- [x] 删除简历：`DELETE /api/v1/resume/:id` → [resume.ts](file:///d:/ai-msw/test/ai-resume/src/api/resume/resume.ts)、[MyResumes.vue](file:///d:/ai-msw/test/ai-resume/src/views/user/MyResumes.vue)
- [x] 下载 PDF：`POST /api/v1/resume/download`（blob）→ [resume.ts](file:///d:/ai-msw/test/ai-resume/src/api/resume/resume.ts)
- [x] 上传图片：`POST /api/v1/upload/image` → [upload.ts](file:///d:/ai-msw/test/ai-resume/src/api/upload/upload.ts)

### 0.2 部分实现（功能存在但与 API_DOCS 设计不完全一致）

- [ ] 使用模板创建简历
  - API_DOCS 期望：`POST /api/v1/template/:id/use`（高）
  - 当前实现：调用 `POST /api/v1/resume` 并传 `templateId`（可用，但与文档不一致）→ [TemplateDetailsPage.vue](file:///d:/ai-msw/test/ai-resume/src/views/template/TemplateDetailsPage.vue)

### 0.3 未实现（按 API_DOCS 或“缺失模块”）

- [ ] User：profile / change-password /（可选）管理员用户 CRUD
- [ ] Resume：copy / preview / search / import / export /（可选）templates 列表
- [ ] Template：update / delete / category / popular / favorites / use（若决定对齐文档）
- [ ] Share：分享链接与分享访问
- [ ] History：简历历史记录

---

## 1. P0（优先级最高）：补齐“用户中心 + 模板/简历核心闭环”

### 1.1 用户信息与安全（User Profile + Change Password）

- [x] Task 1（P0）：实现用户信息获取与更新（/user/profile）
  - [x] 新增 `src/api/user/user.ts`：封装 `GET /user/profile`、`PATCH /user/profile`
  - [x] 新增 `src/api/user/type.ts`：UserProfile、UpdateProfileParams、响应体类型
  - [x] 扩展 `src/stores/auth.ts`：提供 `fetchProfile()`、`updateProfile()`，并同步 `userInfo`
  - [x] 新增路由与页面：`/user/profile`（requiresAuth）
  - [x] 页面能力：展示当前 username/email；支持编辑保存；错误提示与 loading
  - [x] 验证：登录后进入 profile 页面能拉取/更新成功；401 跳转登录；TS 类型检查通过

- [x] **TASK-002（P0）：实现修改密码（/user/change-password）**
  > 涉及模块：User API, Auth Store, UserProfile UI
  - [ ] **1. API 接口定义**
    - [ ] 在 `src/api/user/user.ts` 新增 `changePasswordAPI`
    - [ ] 方法：`PATCH`
    - [ ] 路径：`/user/change-password`
    - [ ] 请求参数类型（`ChangePasswordParams`）：
      - `oldPassword`: string (required)
      - `newPassword`: string (required, min 6)
      - `confirmPassword`: string (required, match newPassword)
    - [ ] 响应：`ApiResponse<void>`
  - [ ] **2. UI 界面实现**
    - [ ] 改造 `src/views/user/UserProfile.vue`，引入 Tabs 布局
      - Tab 1: "基本信息"（迁移现有表单）
      - Tab 2: "账号安全"（新增修改密码表单）
    - [ ] 样式要求：
      - 保持与 Profile 一致的卡片风格与 Grid 布局
      - 表单项：当前密码、新密码、确认新密码（均为 `type="password"`）
      - 按钮：保存修改（Loading 状态支持）
  - [ ] **3. 交互逻辑**
    - [ ] 表单校验规则：
      - 所有字段必填
      - 新密码长度 >= 6
      - `confirmPassword` 必须等于 `newPassword`
    - [ ] 提交处理：
      - 成功：弹出 `message.success`，执行 `authStore.logout()`，跳转 `/login`
      - 失败：弹出 `message.error`（后端返回的 message）
  - [ ] **4. 验收标准**
    - [ ] 输入错误密码时，后端返回 400/401，前端正确提示
    - [ ] 输入新旧密码相同时（如果后端校验），前端正确提示
    - [ ] 修改成功后，Token 失效/清除，用户被重定向至登录页
    - [ ] 再次使用旧密码登录失败，使用新密码登录成功

### 1.2 模板管理完整闭环（Update/Delete）

- [ ] Task 3（P0）：补齐模板更新与删除接口封装
  - [ ] 在 [templates.ts](file:///d:/ai-msw/test/ai-resume/src/api/templates/templates.ts) 增加：
    - [ ] `PATCH /template/:id`
    - [ ] `DELETE /template/:id`
  - [ ] 补齐 `src/api/templates/type.ts` 中的请求/响应类型（UpdateTemplateParams 等）
  - [ ] 验证：类型可用；调用方可正常处理成功/失败；不破坏现有 list/detail/create

- [ ] Task 4（P0）：增加“我的模板/模板管理”页面（仅创建者）
  - [ ] 新增路由：`/user/templates`（requiresAuth）
  - [ ] 页面能力：
    - [ ] 列表展示：复用 `TemplateCard` 或新建 `MyTemplateCard`
    - [ ] 支持编辑模板信息（名称、分类、预览图可选）
    - [ ] 支持删除模板（需二次确认）
  - [ ] 数据来源：
    - [ ] 方案 A：复用 `GET /template` + 前端过滤 userId（不推荐，依赖返回字段）
    - [ ] 方案 B：新增后端“我的模板”接口（推荐，需要后端支持；先在清单中占位）
  - [ ] 验证：创建者可编辑/删除；非创建者不可见或无操作入口

### 1.3 简历复制（提升效率、贴近 API_DOCS）

- [ ] Task 5（P0）：实现简历复制（/resume/:id/copy）
  - [ ] 在 [resume.ts](file:///d:/ai-msw/test/ai-resume/src/api/resume/resume.ts) 增加 `POST /resume/:id/copy`
  - [ ] 在 `src/api/resume/type.ts` 增加 CopyResumeParams、CopyResumeResult
  - [ ] 在 [MyResumes.vue](file:///d:/ai-msw/test/ai-resume/src/views/user/MyResumes.vue) / [ResumeCard.vue](file:///d:/ai-msw/test/ai-resume/src/views/user/components/ResumeCard.vue) 增加“复制”入口
  - [ ] 交互：复制成功后刷新列表并高亮/提示；失败提示
  - [ ] 验证：复制生成新简历（id 不同）；标题按“(副本)”规则（后端决定）正确展示

---

## 2. P1（中优先级）：补齐“可用性增强”与 API_DOCS 缺口接口

### 2.1 简历预览/搜索/导入导出（Resume）

- [ ] Task 6（P1）：实现简历导出 JSON（/resume/:id/export）
  - [ ] 新增 API：`GET /resume/:id/export`（responseType：json）
  - [ ] 在编辑器页增加导出按钮（Header 或更多操作菜单）
  - [ ] 下载策略：直接下载 `.json` 文件（包含 resumeData）
  - [ ] 验证：导出文件可被再次导入（见 Task 7）

- [ ] Task 7（P1）：实现简历导入 JSON（/resume/import）
  - [ ] 新增 API：`POST /resume/import`
  - [ ] UI：文件选择（.json），解析前置校验（字段结构/必填）
  - [ ] 成功后：跳转编辑器并加载新简历 id
  - [ ] 验证：导入后可编辑/保存/下载 PDF

- [ ] Task 8（P1）：实现简历搜索（/resume/search）
  - [ ] 新增 API：`GET /resume/search`（关键词 query）
  - [ ] UI：我的简历页增加搜索框；输入后触发查询并展示结果
  - [ ] 验证：关键词命中标题/基础信息等（以后端实现为准）

- [ ] Task 9（P1）：实现简历预览（/resume/:id/preview）
  - [ ] 新增 API：`GET /resume/:id/preview`
  - [ ] UI：我的简历页增加“预览”入口（可打开抽屉/新页）
  - [ ] 验证：预览渲染与编辑器预览一致（复用 ResumePreview 组件）

### 2.2 模板：分类/热门/对齐“使用模板”接口

- [ ] Task 10（P1）：模板列表增加筛选与搜索（对齐 API_DOCS 的 name 模糊搜索）
  - [ ] 在 [TemplateListPage.vue](file:///d:/ai-msw/test/ai-resume/src/views/template/TemplateListPage.vue) 实现：
    - [ ] 搜索框（name）
    - [ ] 分类筛选（category）
    - [ ] 分页控件（page/pageSize）
  - [ ] 验证：参数变化触发重新请求；空态与加载态正确

- [ ] Task 11（P1）：补齐“热门模板”与“按分类模板”能力（若后端提供）
  - [ ] 新增 API：`GET /template/popular`、`GET /template/category/:category`
  - [ ] UI：模板页增加“热门/分类”入口（Tab/筛选）
  - [ ] 验证：热门按 usedCount 排序；分类过滤正确

- [ ] Task 12（P1）：对齐 API_DOCS 的“使用模板”接口（可选）
  - [ ] 新增 API：`POST /template/:id/use`
  - [ ] 改造 [TemplateDetailsPage.vue](file:///d:/ai-msw/test/ai-resume/src/views/template/TemplateDetailsPage.vue) 使用该接口
  - [ ] 兼容策略：后端未提供时回退到 `POST /resume` + templateId（需要产品/后端确认）

---

## 3. P2（可选/增值）：收藏、分享、历史记录

### 3.1 模板收藏（Favorites）

- [ ] Task 13（P2）：实现模板收藏/取消收藏/收藏列表
  - [ ] 新增 API：`POST /template/:id/favorite`、`DELETE /template/:id/favorite`、`GET /template/favorites`
  - [ ] UI：
    - [ ] TemplateCard/详情页增加收藏按钮（登录后可用）
    - [ ] 新增页面：`/user/favorites`（requiresAuth）
  - [ ] 状态管理：Pinia store（favorites）缓存收藏 id 集合，降低重复请求
  - [ ] 验证：收藏状态与列表一致；刷新后仍正确（持久化/重新拉取策略）

### 3.2 简历分享（Share 模块）

- [ ] Task 14（P2）：实现简历分享链接生成与访问页
  - [ ] 后端接口占位（需后端补充后再落地）：创建分享、获取分享简历、撤销分享
  - [ ] UI：
    - [ ] 编辑器页增加“分享”入口，生成链接并复制
    - [ ] 新增公开路由：`/share/:shareId`，展示只读预览
  - [ ] 安全：分享权限、过期策略、访问频控（以后端为主）
  - [ ] 验证：未登录也可访问分享页（若允许）；撤销后不可访问

### 3.3 简历历史记录（History 模块）

- [ ] Task 15（P2）：实现简历历史版本记录与回滚
  - [ ] 后端接口占位：列出历史版本、查看版本详情、回滚/恢复
  - [ ] UI：编辑器页增加“历史记录”侧栏/抽屉；支持对比与回滚
  - [ ] 验证：历史列表可加载；回滚后保存与下载内容正确

---

## 4. P3（工程化/体验完善）：一致性、错误处理、空态与权限

- [ ] Task 16（P3）：统一 API 响应类型与错误提示策略
  - [ ] 目标：减少 `as unknown as Promise<...>` 的强转，统一 `ApiResponse<T>` 使用方式
  - [ ] 统一 error message：区分业务错误/网络错误/401 重登

- [ ] Task 17（P3）：补齐路由权限与导航入口
  - [ ] NavBar 增加用户菜单：我的简历、个人资料、安全设置、收藏（若实现）
  - [ ] requiresAuth 路由覆盖：profile/security/templates/favorites

- [ ] Task 18（P3）：补齐回归验证脚本与最小 E2E（可选）
  - [ ] 建议用例：登录、模板列表/详情、创建简历、保存、下载 PDF、我的简历删除/复制

---

## Task Dependencies

- Task 2 depends on Task 1（需要先有 profile/用户中心入口与 auth 体系完善）
- Task 4 depends on Task 3
- Task 5 depends on MyResumes/ResumeCard 的稳定交互
- Task 6,7,9 depend on 编辑器页存在稳定的“当前简历 id”与数据结构（已有 store）
- Task 10 depends on `GET /template` 支持分页与 name 查询（后端能力）
- Task 12 depends on 后端是否提供 `/template/:id/use`
- Task 13 depends on 后端 favorites 相关接口
- Task 14,15 depend on Share/History 后端接口设计

---

## Change Log

| Date       | Author | Task ID  | Description                                   |
| :--------- | :----- | :------- | :-------------------------------------------- |
| 2026-02-15 | Trae   | TASK-002 | 补全 Task 2（修改密码）详细设计与验收标准     |
| 2026-02-15 | Trae   | TASK-002 | 完成 Task 2 开发：API 定义、UI 实现、交互逻辑 |
