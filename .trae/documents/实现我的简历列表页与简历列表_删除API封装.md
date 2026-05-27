## 目标
- 按接口文档新增简历列表与删除接口封装：`getUserResumesAPI`、`deleteResumeAPI`。
- 实现“我的简历”列表页：展示卡片列表（标题、修改时间、操作按钮），支持编辑跳转与删除。
- 配置路由 `/user/resumes`（并加上 `meta.requiresAuth` 让现有路由守卫生效）。
- 完成后更新 `PLAN.md` 对应勾选项。

## 代码改动清单
### 1) 完善 API 封装（`src/api/resume/resume.ts`）
- 在 `src/api/resume/type.ts` 增加类型：
  - `UserResumeListItem`：用于“获取当前用户所有简历”列表项（`_id/userId/title/isTemplate/createdAt/updatedAt?` 等）。
  - `DeleteResumeResult`：用于删除接口返回的 `data` 结构（`_id/title`）。
- 在 `src/api/resume/resume.ts` 新增导出：
  - `getUserResumesAPI()`：`GET /resume`，返回 `data: UserResumeListItem[]`。
  - `deleteResumeAPI(id: string)`：`DELETE /resume/:id`，返回 `data: DeleteResumeResult`。

## 2) 实现“我的简历”列表页（`src/views/user/MyResumes.vue`）
- 创建 `src/views/user` 目录与 `MyResumes.vue`，使用 `<script setup lang="ts">`。
- 页面结构对齐现有页面风格（Tailwind + Ant Design Vue）：
  - 顶部标题与说明。
  - 加载态：`a-spin`。
  - 空态：`a-empty`。
  - 列表：卡片网格（标题、更新时间/创建时间、按钮：编辑/删除）。
- 数据与交互：
  - `onMounted` 拉取 `getUserResumesAPI()`，仅使用 `finally` 关闭 loading；不使用 `catch`（错误提示交给拦截器）。
  - 编辑：点击“编辑”时，先调用 `useResumeStore().getResumeDetail(id)` 预加载简历数据，再跳转到 `/editor`（保证当前阶段即可编辑；后续 Phase 1 的“编辑器按 URL id 初始化”完成后可改为直接带 id 跳转）。
  - 删除：使用 `Modal.confirm` 二次确认；`onOk` 内调用 `deleteResumeAPI(id)`，成功后从列表中移除并 `message.success("删除成功")`；仅用 `finally` 清理按钮 loading 状态。
  - 时间展示：优先显示 `updatedAt`，没有则回退到 `createdAt`，使用 `src/utils/day.ts` 的 `formatDate`。

## 3) 配置路由（`src/router/index.ts`）
- 在根布局路由 `/` 的 `children` 中新增：
  - `path: "/user/resumes"`
  - `name: "MyResumes"`
  - `component: () => import("@/views/user/MyResumes.vue")`
  - `meta: { title: "我的简历", requiresAuth: true }`
- 这样页面会复用 `HomePage.vue` 的 `NavBar/Footer` 布局，并触发现有登录守卫。

## 4) 更新规划文档（`PLAN.md`）
- 将以下项标记为已完成（`[x]`）：
  - “完善 API 封装”下的 `getUserResumesAPI`、`deleteResumeAPI`
  - “实现我的简历列表页”下的 4 个子项（页面、列表展示、编辑/删除、路由 `/user/resumes`）

## 5) 验证方式（实现后执行）
- 启动开发服务器并人工验证：
  - 登录后访问 `/user/resumes`：能正常加载、空态/加载态正常。
  - 点击“编辑”能进入 `/editor` 且渲染预加载的简历内容。
  - 点击“删除”确认后能从列表移除；接口失败时由拦截器提示。
- 运行 TypeScript/Lint 检查，确保无类型与未使用变量问题。