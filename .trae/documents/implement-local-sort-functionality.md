# 局部排序功能实现计划

## 需求概述
为简历编辑器中的数组类型字段实现局部排序功能，包括：
1. 在 `resumeStore.ts` 中实现所有 `move*Experience` 函数
2. 在所有表单组件中添加上移按钮 UI 元素及相关交互逻辑
3. 确保排序操作正确处理各种边缘情况

## 涉及的文件

### 类型定义文件
- `d:\ai-msw\test\ai-resume\src\stores\type.ts`
  - 已包含 `localSort` 字段定义，无需修改

### Store 文件
- `d:\ai-msw\test\ai-resume\src\stores\resumeStore.ts`
  - 需要实现 5 个 `move*Experience` 函数

### 表单组件文件
- `d:\ai-msw\test\ai-resume\src\views\editor\components\drawer\EducationForm.vue`
- `d:\ai-msw\test\ai-resume\src\views\editor\components\drawer\WorkExperienceForm.vue`
- `d:\ai-msw\test\ai-resume\src\views\editor\components\drawer\ProjectExperienceForm.vue`
- `d:\ai-msw\test\ai-resume\src\views\editor\components\drawer\CampusExperienceForm.vue`
- `d:\ai-msw\test\ai-resume\src\views\editor\components\drawer\InternshipExperienceForm.vue`

## 实现步骤

### 步骤 1：实现 Store 中的局部排序函数

#### 1.1 实现 `moveEducation` 函数
**位置**: `resumeStore.ts` 第 330 行
**功能**: 交换教育经历数组中相邻两个元素的 `localSort` 值
**实现逻辑**:
1. 检查索引有效性（index >= 0 && index < educationBackground.length - 1）
2. 根据 direction 参数确定交换方向：
   - "up": 与前一个元素交换
   - "down": 与后一个元素交换
3. 交换两个元素的 `localSort` 值
4. 对数组按 `localSort` 重新排序

#### 1.2 实现 `moveWorkExperience` 函数
**位置**: `resumeStore.ts` 第 370 行
**功能**: 交换工作经历数组中相邻两个元素的 `localSort` 值
**实现逻辑**: 同 `moveEducation`，但作用于 `workExperience` 数组

#### 1.3 实现 `moveProjectExperience` 函数
**位置**: `resumeStore.ts` 第 411 行
**功能**: 交换项目经历数组中相邻两个元素的 `localSort` 值
**实现逻辑**: 同 `moveEducation`，但作用于 `projectExperience` 数组

#### 1.4 实现 `moveCampusExperience` 函数
**位置**: `resumeStore.ts` 第 455 行
**功能**: 交换校园经历数组中相邻两个元素的 `localSort` 值
**实现逻辑**: 同 `moveEducation`，但作用于 `campusExperience` 数组

#### 1.5 实现 `moveInternshipExperience` 函数
**位置**: `resumeStore.ts` 第 499 行
**功能**: 交换实习经历数组中相邻两个元素的 `localSort` 值
**实现逻辑**: 同 `moveEducation`，但作用于 `internshipExperience` 数组

### 步骤 2：在表单组件中添加上移按钮

#### 2.1 修改 `EducationForm.vue`
**位置**: 第 154-174 行（右侧操作按钮区域）
**修改内容**:
1. 在 script 部分导入 `ArrowUpOutlined` 图标
2. 在下移按钮之前添加上移按钮
3. 上移按钮的禁用条件：`index === 0`

#### 2.2 修改 `WorkExperienceForm.vue`
**位置**: 第 131-151 行（右侧操作按钮区域）
**修改内容**: 同 `EducationForm.vue`

#### 2.3 修改 `ProjectExperienceForm.vue`
**位置**: 第 128-148 行（右侧操作按钮区域）
**修改内容**: 同 `EducationForm.vue`

#### 2.4 修改 `CampusExperienceForm.vue`
**位置**: 第 128-148 行（右侧操作按钮区域）
**修改内容**: 同 `EducationForm.vue`

#### 2.5 修改 `InternshipExperienceForm.vue`
**位置**: 第 131-151 行（右侧操作按钮区域）
**修改内容**: 同 `EducationForm.vue`

### 步骤 3：验证和测试

#### 3.1 TypeScript 类型检查
运行 `npm run build` 确保没有类型错误

#### 3.2 功能测试
- 测试上移按钮在第一项时正确禁用
- 测试下移按钮在最后一项时正确禁用
- 测试上移操作正确交换元素位置
- 测试下移操作正确交换元素位置
- 测试排序后 `localSort` 值正确更新
- 测试数组重新排序后 UI 正确显示

## 边缘情况处理

1. **空数组**: 当数组为空时，不执行任何操作
2. **单个元素**: 当数组只有一个元素时，上移和下移按钮都应该禁用
3. **第一项上移**: 当 index 为 0 且 direction 为 "up" 时，不执行操作
4. **最后一项下移**: 当 index 为 length - 1 且 direction 为 "down" 时，不执行操作
5. **无效索引**: 当 index 超出数组范围时，不执行操作
6. **undefined localSort**: 当元素的 `localSort` 为 undefined 时，使用默认值 0

## UI 设计规范

### 上移按钮
- 类型: `type="primary"`
- 大小: `size="small"`
- 图标: `ArrowUpOutlined`
- 禁用条件: `index === 0`
- 位置: 在下移按钮之前

### 下移按钮
- 类型: `type="primary"`
- 大小: `size="small"`
- 图标: `ArrowDownOutlined`
- 禁用条件: `index === data.length - 1`
- 位置: 在上移按钮之后、删除按钮之前

### 按钮顺序
从上到下依次为：
1. 上移按钮
2. 下移按钮
3. 删除按钮

## 代码实现细节

### Store 函数实现模板
```typescript
const moveExperience = (index: number, direction: "up" | "down") => {
  const list = resumeData.value.experienceArray;
  if (!list || list.length <= 1) return;

  let targetIndex: number;
  if (direction === "up") {
    if (index === 0) return;
    targetIndex = index - 1;
  } else {
    if (index === list.length - 1) return;
    targetIndex = index + 1;
  }

  const tempLocalSort = list[index]?.localSort ?? 0;
  list[index]!.localSort = list[targetIndex]?.localSort ?? 0;
  list[targetIndex]!.localSort = tempLocalSort;

  list.sort((a, b) => (a.localSort ?? 0) - (b.localSort ?? 0));
};
```

### 组件上移按钮模板
```vue
<Button
  type="primary"
  size="small"
  :icon="h(ArrowUpOutlined)"
  @click="handleMove(index, 'up')"
  :disabled="index === 0"
>
  上移
</Button>
```

## 预期结果

完成所有步骤后：
1. 所有 5 个 `move*Experience` 函数都能正确执行局部排序
2. 所有 5 个表单组件都包含上移和下移两个按钮
3. 按钮的禁用状态正确反映当前位置
4. 排序操作后，数组元素按 `localSort` 值重新排序
5. UI 正确显示排序后的元素顺序
6. 代码通过 TypeScript 类型检查和构建
