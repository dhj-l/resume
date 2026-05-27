# ESLint 规则说明文档

## 概述

本文档详细说明了项目中配置的 ESLint 规则及其作用。ESLint 是一个可配置的 JavaScript 和 TypeScript 代码检查工具，用于识别和报告代码中的问题，提高代码质量和一致性。

## 规则级别说明

- **error**: 必须修复，会导致 CI/CD 失败，阻止代码提交
- **warn**: 建议修复，不会阻止构建，但应该在方便时修复
- **off**: 禁用该规则

## 核心规则配置

### 1. 基础规则 (ESLint)

#### `no-console` (warn/production)
- **作用**: 禁止使用 `console.log` 等调试语句
- **配置理由**: 生产环境代码不应该包含调试语句
- **示例**:
  ```javascript
  // ❌ 错误
  console.log('debug info');
  
  // ✅ 正确 - 使用日志工具
  logger.info('info message');
  ```

#### `no-debugger` (warn/production)
- **作用**: 禁止使用 `debugger` 语句
- **配置理由**: 生产环境不应该包含调试断点
- **示例**:
  ```javascript
  // ❌ 错误
  debugger;
  
  // ✅ 正确 - 移除调试语句
  ```

#### `no-var` (error)
- **作用**: 要求使用 `let` 或 `const` 而不是 `var`
- **配置理由**: `let` 和 `const` 具有块级作用域，更符合现代 JavaScript 最佳实践
- **示例**:
  ```javascript
  // ❌ 错误
  var count = 1;
  
  // ✅ 正确
  let count = 1;
  const MAX = 100;
  ```

#### `prefer-const` (warn)
- **作用**: 如果一个变量不会被重新赋值，优先使用 `const`
- **配置理由**: 使用 `const` 可以明确表达变量不会被重新赋值的意图
- **示例**:
  ```javascript
  // ❌ 错误
  let name = 'John';
  
  // ✅ 正确
  const name = 'John';
  ```

### 2. TypeScript 特定规则

#### `@typescript-eslint/no-unused-vars` (warn)
- **作用**: 禁止定义未使用的变量
- **配置理由**: 未使用的变量是冗余代码，会影响代码可读性
- **配置选项**: 忽略以下划线开头的变量
- **示例**:
  ```typescript
  // ❌ 错误
  const unused = 1;
  
  // ✅ 正确 - 使用下划线前缀
  const _unused = 1;
  
  // ✅ 正确 - 使用变量
  const used = 1;
  console.log(used);
  ```

#### `@typescript-eslint/no-explicit-any` (warn)
- **作用**: 禁止使用 `any` 类型
- **配置理由**: 使用 `any` 会失去 TypeScript 的类型检查优势
- **示例**:
  ```typescript
  // ❌ 错误
  function process(value: any) {
    return value;
  }
  
  // ✅ 正确 - 使用具体类型或 unknown
  function process(value: unknown) {
    return value;
  }
  
  // ✅ 正确 - 使用泛型
  function process<T>(value: T): T {
    return value;
  }
  ```

#### `@typescript-eslint/no-non-null-assertion` (warn)
- **作用**: 禁止使用非空断言操作符 `!`
- **配置理由**: 非空断言可能隐藏潜在的空值错误
- **示例**:
  ```typescript
  // ❌ 错误
  const length = value!.length;
  
  // ✅ 正确 - 使用可选链或空值检查
  const length = value?.length ?? 0;
  ```

#### `@typescript-eslint/explicit-function-return-type` (off)
- **作用**: 要求显式指定函数返回类型
- **配置理由**: 关闭此规则以减少冗余代码，TypeScript 可以自动推断大部分返回类型

### 3. Vue 特定规则

#### `vue/multi-word-component-names` (off)
- **作用**: 要求组件名由多个单词组成
- **配置理由**: 关闭此规则以允许单字组件名，提高灵活性

#### `vue/no-mutating-props` (warn)
- **作用**: 禁止在组件内部直接修改 props
- **配置理由**: 直接修改 props 会违反 Vue 的单向数据流原则
- **示例**:
  ```vue
  <script setup>
  const props = defineProps(['items']);
  
  // ❌ 错误
  props.items.push(newItem);
  
  // ✅ 正确 - 创建本地副本
  const localItems = ref([...props.items]);
  localItems.value.push(newItem);
  </script>
  ```

#### `vue/require-prop-types` (warn)
- **作用**: 要求 props 定义类型
- **配置理由**: 类型定义可以提高代码可读性和类型安全性
- **示例**:
  ```vue
  <script setup>
  // ❌ 错误
  const props = defineProps(['name']);
  
  // ✅ 正确
  const props = defineProps({
    name: {
      type: String,
      required: true
    }
  });
  </script>
  ```

#### `vue/no-v-html` (warn)
- **作用**: 禁止使用 `v-html` 指令
- **配置理由**: `v-html` 可能导致 XSS 攻击，应该谨慎使用
- **示例**:
  ```vue
  <!-- ❌ 错误 -->
  <div v-html="userInput"></div>
  
  <!-- ✅ 正确 - 使用文本插值 -->
  <div>{{ userInput }}</div>
  ```

### 4. 导入规则 (eslint-plugin-import)

#### `import/first` (error)
- **作用**: 要求所有导入语句放在文件顶部
- **配置理由**: 统一的导入位置提高代码可读性
- **示例**:
  ```javascript
  // ❌ 错误
  import a from 'a';
  const b = 1;
  import c from 'c';
  
  // ✅ 正确
  import a from 'a';
  import c from 'c';
  const b = 1;
  ```

#### `import/newline-after-import` (warn)
- **作用**: 要求在导入语句后添加空行
- **配置理由**: 空行分隔导入和其他代码，提高可读性
- **示例**:
  ```javascript
  // ❌ 错误
  import React from 'react';
  const Component = () => {};
  
  // ✅ 正确
  import React from 'react';
  
  const Component = () => {};
  ```

#### `import/no-duplicates` (error)
- **作用**: 禁止重复导入同一模块
- **配置理由**: 重复导入是冗余的，会降低代码质量
- **示例**:
  ```javascript
  // ❌ 错误
  import { a } from 'module';
  import { b } from 'module';
  
  // ✅ 正确
  import { a, b } from 'module';
  ```

#### `import/order` (warn)
- **作用**: 要求导入语句按特定顺序排列
- **配置理由**: 统一的导入顺序提高代码可读性和一致性
- **分组顺序**:
  1. 内置模块 (builtin)
  2. 外部模块 (external)
  3. 内部模块 (internal - `@/*`)
  4. 父级模块 (parent)
  5. 兄弟模块 (sibling)
  6. 索引模块 (index)
- **示例**:
  ```javascript
  // ✅ 正确
  import fs from 'fs';
  import React from 'react';
  import { defineComponent } from 'vue';
  
  import { api } from '@/api';
  
  import { parent } from '../parent';
  import { sibling } from './sibling';
  import { index } from './';
  ```

### 5. Prettier 集成规则

#### `prettier/prettier` (warn)
- **作用**: 强制执行 Prettier 代码格式化规则
- **配置理由**: 确保代码格式一致性，减少代码审查中的格式争论
- **格式化规则**:
  - 行宽：100 字符
  - 缩进：2 空格
  - 引号：双引号
  - 分号：使用
  - 尾随逗号：使用 (ES5 支持的地方)

## Prettier 配置说明

### `.prettierrc` 配置

```json
{
  "semi": true,              // 使用分号
  "singleQuote": false,      // 使用双引号
  "tabWidth": 2,             // 缩进 2 空格
  "useTabs": false,          // 使用空格而非 tab
  "trailingComma": "all",    // 使用尾随逗号
  "printWidth": 100,         // 行宽 100 字符
  "bracketSpacing": true,    // 对象字面量括号内加空格
  "arrowParens": "always",   // 箭头函数参数始终加括号
  "endOfLine": "lf"          // 使用 LF 换行符
}
```

## 使用方法

### 命令行

```bash
# 检查所有文件
pnpm lint

# 自动修复可修复的问题
pnpm lint:fix

# 仅检查（用于 CI/CD）
pnpm lint:check

# 格式化代码
pnpm format

# 检查格式（用于 CI/CD）
pnpm format:check
```

### IDE 集成

项目已配置 VS Code 设置，实现：
- 保存时自动运行 ESLint 修复
- 保存时自动格式化代码
- 实时显示 ESLint 警告和错误

### 推荐安装的 VS Code 扩展

1. **Vue.volar** - Vue 3 语言支持
2. **dbaeumer.vscode-eslint** - ESLint 集成
3. **esbenp.prettier-vscode** - Prettier 格式化

## 最佳实践建议

1. **提交前检查**: 在提交代码前运行 `pnpm lint` 和 `pnpm format`
2. **启用保存时修复**: 使用 VS Code 的保存时自动修复功能
3. **团队一致性**: 所有团队成员应该使用相同的 ESLint 和 Prettier 配置
4. **CI/CD 集成**: 在持续集成流程中添加 `pnpm lint:check` 和 `pnpm format:check`
5. **逐步修复**: 对于现有代码库，可以逐步修复 ESLint 警告，不要一次性全部修复

## 自定义规则

如果团队需要自定义规则，可以在 `eslint.config.js` 中添加：

```javascript
{
  rules: {
    // 自定义规则
    'no-console': 'off', // 如果团队允许 console.log
    'max-lines': ['warn', { max: 300 }] // 文件最大行数
  }
}
```

## 常见问题

### Q: 为什么有些规则是 warn 而不是 error？
A: 对于不影响代码正确性的风格问题，使用 warn 级别可以减少开发阻力，让开发者在方便时修复。

### Q: 如何禁用某条规则？
A: 在代码中添加注释：
```javascript
// eslint-disable-next-line no-console
console.log('debug');

/* eslint-disable no-unused-vars */
const unused = 1;
/* eslint-enable no-unused-vars */
```

### Q: ESLint 和 Prettier 冲突怎么办？
A: 已配置 `eslint-config-prettier` 禁用所有与 Prettier 冲突的 ESLint 规则，不会发生冲突。

## 更新日志

- **2026-04-14**: 初始配置
  - 集成 ESLint 9.x 扁平配置
  - 添加 Vue 3 + TypeScript 支持
  - 配置 Prettier 集成
  - 设置导入排序规则
  - 配置 IDE 自动修复
