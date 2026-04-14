# AI Resume - Vue 3 + TypeScript + Vite

基于 Vue 3 和 TypeScript 的智能简历生成系统，使用 Vite 作为构建工具。

## 技术栈

- **框架**: Vue 3.5+ (Composition API with `<script setup>`)
- **语言**: TypeScript 5.9+
- **构建工具**: Vite 7+
- **状态管理**: Pinia 3+
- **路由**: Vue Router 4+
- **UI 框架**: 
  - Ant Design Vue 4+
  - Element Plus 2+
- **富文本编辑器**: WangEditor 5+
- **HTTP 客户端**: Axios
- **代码质量工具**: ESLint 9+ + Prettier 3+

## 项目设置

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

## 代码质量检查

### ESLint 检查

```bash
# 检查所有文件并自动修复可修复的问题
pnpm lint

# 仅检查（用于 CI/CD）
pnpm lint:check

# 自动修复
pnpm lint:fix
```

### Prettier 格式化

```bash
# 格式化所有文件
pnpm format

# 检查格式（用于 CI/CD）
pnpm format:check
```

## IDE 配置

### 推荐安装的 VS Code 扩展

1. **Vue.volar** - Vue 3 语言支持
2. **dbaeumer.vscode-eslint** - ESLint 集成
3. **esbenp.prettier-vscode** - Prettier 格式化

### 自动修复

项目已配置保存时自动修复：
- 保存时自动运行 ESLint 修复
- 保存时自动格式化代码
- 保存时自动组织导入

## ESLint 规则配置

项目使用 ESLint 9.x 的扁平配置格式，包含以下规则集：

### 核心规则
- ✅ ESLint 推荐规则
- ✅ TypeScript ESLint 规则
- ✅ Vue 3 推荐规则
- ✅ Prettier 集成
- ✅ 导入排序规则

### 主要规则说明

详细规则说明请参阅 [ESLint 规则文档](./docs/ESLINT_RULES.md)

#### TypeScript 规则
- 禁止使用 `any` 类型 (warn)
- 禁止未使用的变量 (warn)
- 允许空对象类型 (off)

#### Vue 规则
- 允许单字组件名 (off)
- 禁止修改 props (warn)
- 要求 props 定义类型 (warn)

#### 导入规则
- 导入语句按顺序排列 (warn)
- 禁止重复导入 (error)
- 导入后添加空行 (warn)

#### 代码风格
- 使用双引号
- 使用分号
- 2 空格缩进
- 行宽限制：100 字符

## 项目结构

```
ai-resume/
├── src/
│   ├── api/              # API 接口定义
│   ├── assets/           # 静态资源
│   ├── components/       # 公共组件
│   ├── http/             # HTTP 请求封装
│   ├── layouts/          # 布局组件
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia 状态管理
│   ├── utils/            # 工具函数
│   ├── views/            # 页面组件
│   ├── App.vue           # 根组件
│   └── main.ts           # 入口文件
├── docs/
│   └── ESLINT_RULES.md   # ESLint 规则文档
├── .vscode/
│   ├── extensions.json   # 推荐扩展
│   └── settings.json     # VS Code 配置
├── .eslintignore         # ESLint 忽略文件
├── .prettierrc           # Prettier 配置
├── .prettierignore       # Prettier 忽略文件
├── eslint.config.js      # ESLint 配置
├── package.json          # 项目依赖
├── tsconfig.json         # TypeScript 配置
├── vite.config.ts        # Vite 配置
└── README.md             # 项目文档
```

## 开发规范

### 代码提交前检查清单

- [ ] 运行 `pnpm lint` 确保没有 ESLint 错误
- [ ] 运行 `pnpm format` 确保代码格式正确
- [ ] 运行 `pnpm build` 确保构建成功
- [ ] 测试关键功能是否正常

### Git Hooks (可选)

可以配置 Husky 在提交前自动运行 lint 检查：

```bash
pnpm add -D husky
npx husky install
npx husky add .husky/pre-commit "pnpm lint:check && pnpm format:check"
```

## 常见问题

### Q: ESLint 报错怎么办？

A: 
1. 运行 `pnpm lint:fix` 尝试自动修复
2. 查看具体错误信息，手动修复
3. 参考 [ESLint 规则文档](./docs/ESLINT_RULES.md) 了解规则详情

### Q: 如何禁用某条 ESLint 规则？

A: 在代码中添加注释：

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function process(value: any) {
  // ...
}
```

### Q: Prettier 和 ESLint 冲突怎么办？

A: 项目已配置 `eslint-config-prettier`，不会发生冲突。如果遇到冲突，请确保使用项目配置的 Prettier 版本。

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT License

## 更新日志

### 2026-04-14
- ✅ 集成 ESLint 9.x 代码检查系统
- ✅ 集成 Prettier 3.x 代码格式化
- ✅ 配置 VS Code IDE 自动修复
- ✅ 添加详细的 ESLint 规则文档
- ✅ 添加 npm scripts 支持 lint 和 format 命令

---

**注意**: 详细的项目开发文档请参阅项目根目录下的其他文档。
