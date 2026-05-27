# ESLint 配置验证指南

## 验证步骤

### 1. 确认依赖已安装

首先确保所有 ESLint 相关依赖已正确安装：

```bash
# 检查 node_modules 是否存在
ls node_modules

# 检查关键依赖
ls node_modules | grep eslint
ls node_modules | grep prettier
```

应该看到以下包：
- `eslint`
- `eslint-plugin-vue`
- `@typescript-eslint/parser`
- `@typescript-eslint/eslint-plugin`
- `eslint-config-prettier`
- `eslint-plugin-prettier`
- `eslint-plugin-import`
- `prettier`

### 2. 安装依赖（如果未安装）

```bash
# 使用 pnpm 安装
pnpm install

# 或者使用 npm
npm install

# 或者使用 yarn
yarn install
```

### 3. 验证 ESLint 配置

```bash
# 运行 ESLint 检查（不修复）
pnpm lint:check

# 运行 ESLint 检查并自动修复
pnpm lint:fix

# 运行 Prettier 格式检查
pnpm format:check

# 运行 Prettier 格式化
pnpm format
```

### 4. 预期输出

#### 成功情况
如果配置正确，应该看到类似输出：

```bash
$ pnpm lint:check

> ai-resume@0.0.0 lint:check
> eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --ignore-path .gitignore

# 如果没有错误，不会有输出或只显示检查的文件数
```

#### 发现问题
如果发现 lint 错误，会显示：

```bash
$ pnpm lint:check

/path/to/file.vue
  10:5  warning  Unexpected console statement  no-console
  15:3  error    Missing return type           @typescript-eslint/explicit-function-return-type

✖ 2 problems (1 error, 1 warning)
```

### 5. 测试 IDE 集成

1. 打开项目中的任意 `.vue` 或 `.ts` 文件
2. 故意制造一个 ESLint 错误（如添加 `console.log`）
3. 应该看到黄色波浪线警告
4. 保存文件，应该自动修复或显示警告

### 6. 验证配置文件

检查以下配置文件是否存在：

```bash
# ESLint 配置
ls eslint.config.js

# Prettier 配置
ls .prettierrc
ls .prettierignore

# ESLint 忽略文件
ls .eslintignore

# VS Code 配置
ls .vscode/settings.json
ls .vscode/extensions.json

# 文档
ls docs/ESLINT_RULES.md
```

## 常见问题排查

### 问题 1: ESLint 未找到

**错误**: `command not found: eslint`

**解决方案**:
```bash
# 确保依赖已安装
pnpm install

# 或者使用 npx 运行
npx eslint --version
```

### 问题 2: 配置文件错误

**错误**: `Failed to read ESLint config`

**解决方案**:
1. 检查 `eslint.config.js` 语法是否正确
2. 确保使用 ESLint 9.x 的扁平配置格式
3. 确认所有引用的插件已安装

### 问题 3: TypeScript 解析错误

**错误**: `Parsing error: Cannot read file tsconfig.json`

**解决方案**:
1. 检查 `tsconfig.app.json` 和 `tsconfig.node.json` 是否存在
2. 确认 `eslint.config.js` 中的路径配置正确
3. 确保 TypeScript 已安装

### 问题 4: Vue 文件解析错误

**错误**: `Parsing error: Unexpected token <`

**解决方案**:
1. 确保 `eslint-plugin-vue` 已安装
2. 检查 `eslint.config.js` 中是否配置了 Vue 插件
3. 确认 `parserOptions.extraFileExtensions` 包含 `.vue`

### 问题 5: Prettier 与 ESLint 冲突

**错误**: 同时运行 lint 和 format 时报错

**解决方案**:
1. 已配置 `eslint-config-prettier`，理论上不会冲突
2. 确保 `.prettierrc` 配置正确
3. 检查 VS Code 设置中是否正确配置了格式化器

## 性能优化建议

### 1. 使用缓存

在 CI/CD 中使用缓存加速 lint 检查：

```bash
# ESLint 缓存
pnpm lint --cache

# 使用缓存文件
pnpm lint --cache --cache-location node_modules/.cache/eslint
```

### 2. 忽略不必要的文件

确保 `.eslintignore` 包含：
- `node_modules/`
- `dist/`
- `build/`
- `public/`
- `*.min.js`

### 3. 并行检查

对于大型项目，可以使用 `eslint-parallel`：

```bash
pnpm add -D eslint-parallel
npx eslint-parallel --ext .vue,.ts,.js src/
```

## CI/CD 集成示例

### GitHub Actions

```yaml
name: Code Quality

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint:check
      - run: pnpm format:check
```

### GitLab CI

```yaml
lint:
  stage: test
  image: node:18
  script:
    - pnpm install
    - pnpm lint:check
    - pnpm format:check
```

## 成功标准

配置成功的标志：

- ✅ 运行 `pnpm lint:check` 无错误（允许警告）
- ✅ 运行 `pnpm format:check` 通过
- ✅ VS Code 保存时自动修复
- ✅ IDE 实时显示 lint 警告
- ✅ 团队成员使用相同配置
- ✅ CI/CD 流程集成 lint 检查

## 下一步

配置完成后：

1. 在团队中分享配置
2. 在 CI/CD 中集成检查
3. 定期审查和更新规则
4. 根据团队反馈调整规则级别

---

**提示**: 如果遇到任何问题，请参考 [ESLint 规则文档](./ESLINT_RULES.md) 或查看官方文档。
