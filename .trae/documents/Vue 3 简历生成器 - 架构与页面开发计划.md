# 简历生成器项目 - 非编辑器页面开发计划

根据你的需求，我们将优先完成除简历编辑器之外的所有核心页面和功能。以下是详细的实施计划：

## 1. 项目初始化与配置

* [ ] **初始化项目**：使用 Vite 创建 Vue 3 + TypeScript 项目。

* [ ] **安装依赖**：

  * 核心：`vue-router`, `pinia`, `axios`

  * UI 库：`element-plus` (用于后台管理), `tailwindcss` (用于前台落地页), `@element-plus/icons-vue`

  * 工具：`sass`, `eslint`, `prettier`

* [ ] **配置环境**：设置 Tailwind CSS, Element Plus 按需引入, 配置 ESLint 规则。

## 2. 架构搭建

* [ ] **目录结构创建**：建立 `layouts`, `views`, `stores`, `components`, `api`, `types` 等目录。

* [ ] **路由配置**：

  * 定义路由表（Home, Login, Register, Dashboard, TemplateSelection）。

  * 实现路由守卫（检查登录状态）。

* [ ] **状态管理 (Pinia)**：

  * `auth.ts`: 管理用户登录状态和 Token。

  * `resume.ts`: 管理简历列表数据。

## 3. 页面开发

### 3.1 布局 (Layouts)

* [ ] **DefaultLayout**：用于首页，包含顶部导航栏和底部 Footer。

* [ ] **AuthLayout**：用于登录注册页，采用居中卡片式布局。

* [ ] **DashboardLayout**：用于用户中心，包含侧边栏 (Sidebar) 和顶部栏 (Header)。

### 3.2 首页 (Landing Page)

* [ ] **Hero 区域**：展示项目 Slogan 和 "立即制作" 按钮。

* [ ] **特性介绍**：使用 Tailwind 网格布局展示功能特点。

### 3.3 认证模块 (Auth)

* [ ] **登录页**：使用 Element Plus 表单组件，实现登录逻辑。

* [ ] **注册页**：实现用户注册表单。

### 3.4 用户中心 (Dashboard)

* [ ] **简历列表**：展示用户已创建的简历卡片（缩略图、名称、操作按钮）。

* [ ] **新建入口**：点击跳转至模板选择页。

* [ ] **空状态**：无简历时的引导展示。

### 3.5 模板选择 (Template Selection)

* [ ] **模板库展示**：展示可选的简历模板列表。

* [ ] **筛选功能**：简单的模板分类筛选。

* [ ] **预览模态框**：点击模板查看大图详情。

## 4. 验证与交付

* [ ] **功能测试**：验证路由跳转、登录状态保持、页面布局响应式。

* [ ] **代码检查**：确保所有代码符合 ESLint 规范且无 TS 类型错误。

