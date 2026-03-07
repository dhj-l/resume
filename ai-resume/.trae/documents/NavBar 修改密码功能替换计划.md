# NavBar 组件功能替换计划

## 任务概述
将导航栏中的"个人中心"功能替换为"修改密码"功能，并彻底移除所有与"个人中心"相关的代码实现。

## 当前代码分析

### 1. NavBar.vue 组件 (d:\ai-msw\test\ai-resume\src\components\layout\NavBar.vue)
需要修改的内容：
- **模板部分 (Lines 74-76)**: 
  - 当前：`<a-menu-item key="profile" @click="handleProfileClick"><UserOutlined /> 个人中心</a-menu-item>`
  - 需改为：`<a-menu-item key="change-password" @click="handleChangePasswordClick"><LockOutlined /> 修改密码</a-menu-item>`
  
- **导入部分 (Line 109)**:
  - 当前：`import { UserOutlined, LogoutOutlined } from "@ant-design/icons-vue";`
  - 需改为：`import { LockOutlined, LogoutOutlined } from "@ant-design/icons-vue";`
  
- **脚本部分 (Lines 142-144)**:
  - 当前：`handleProfileClick` 方法，路由跳转到 `/user/profile`
  - 需改为：`handleChangePasswordClick` 方法（暂时不实现具体功能）

### 2. 路由配置 (d:\ai-msw\test\ai-resume\src\router\index.ts)
需要移除的内容：
- **Lines 39-44**: UserProfile 路由配置
  ```typescript
  {
    name: "UserProfile",
    path: "/user/profile",
    component: () => import("@/views/user/UserProfile.vue"),
    meta: { title: "个人中心", requiresAuth: true },
  }
  ```

### 3. UserProfile.vue 视图文件
- 文件位置：`d:\ai-msw\test\ai-resume\src\views\user\UserProfile.vue`
- 处理方式：暂时保留文件，但移除路由引用（避免破坏可能的其他引用）

## 实施步骤

### 步骤 1: 修改 NavBar.vue 组件
1.1 更新模板部分 (Lines 74-76)
   - 将 `key="profile"` 改为 `key="change-password"`
   - 将 `@click="handleProfileClick"` 改为 `@click="handleChangePasswordClick"`
   - 将 `<UserOutlined />` 改为 `<LockOutlined />`
   - 将文本"个人中心"改为"修改密码"

1.2 更新导入语句 (Line 109)
   - 移除 `UserOutlined`
   - 添加 `LockOutlined`
   - 保留 `LogoutOutlined`

1.3 更新脚本部分 (Lines 142-144)
   - 将方法名从 `handleProfileClick` 改为 `handleChangePasswordClick`
   - 方法体暂时保持简单实现或留空（根据需求说明，暂不实现具体功能）

### 步骤 2: 清理路由配置
2.1 修改 router/index.ts
   - 移除 UserProfile 路由配置对象（Lines 39-44）
   - 确保其他路由配置不受影响

### 步骤 3: 验证修改
3.1 检查代码语法正确性
3.2 确认无 TypeScript 错误
3.3 确认导航栏显示正常
3.4 确认"修改密码"菜单项正确显示
3.5 确认"个人中心"相关代码已完全移除

## 注意事项
- 此修改为临时需求，现阶段无需实现"修改密码"的具体功能逻辑
- 仅需完成界面元素的替换和旧功能代码的清理
- UserProfile.vue 文件暂时保留，避免后续可能需要恢复
- 确保修改后不会导致任何运行时错误
- 保持代码风格与现有代码一致

## 预期结果
1. 导航栏用户下拉菜单中显示"修改密码"而非"个人中心"
2. 图标从 UserOutlined 变为 LockOutlined
3. 路由配置中不再包含 `/user/profile` 路径
4. 所有 `handleProfileClick` 相关代码被移除或重命名
5. 代码编译无错误，界面显示正常
