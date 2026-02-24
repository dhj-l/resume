# 导入已有简历功能实现计划

## 需求概述
在 `TemplateDetailsPage.vue` 的操作按钮区域添加"导入已有简历"按钮，点击后弹出简化版上传简历对话框（无JD输入框），确定后显示全屏加载状态。

## 现有架构分析

### 已有组件
1. **UploadResumeDialog.vue** - 包含简历上传和JD输入的完整对话框
2. **FullScreenLoading.vue** - 全屏加载组件
3. **parseResumeAPI** - 简历解析API
4. **generateAiResumeAPI** - AI生成简历API（支持 `parseType: "upload"`）

### 现有流程
```
用户点击"AI 帮我写" → CreateModeDialog → 选择模式 → 
  - manual → AiCreateDialog（手动输入）
  - select → SelectResumeDialog（选择已有简历）
  - upload → UploadResumeDialog（上传简历+JD）
```

## 实现方案

### 1. 创建新组件：ImportResumeDialog.vue
基于 `UploadResumeDialog.vue` 简化：
- 移除JD输入框部分
- 保留简历上传功能
- 保留文本编辑功能

**组件Props:**
```typescript
interface Props {
  open: boolean;
  submitting?: boolean;
}
```

**组件Emits:**
```typescript
emit("update:open", value: boolean);
emit("submit", payload: { resumeText: string });
```

### 2. 修改 TemplateDetailsPage.vue

#### 2.1 添加按钮
在"立即使用该模板"按钮之后添加"导入已有简历"按钮：
```vue
<a-button
  size="large"
  block
  :loading="isImportingResume"
  @click="handleImportResume"
  class="flex items-center justify-center gap-2 h-12"
>
  <template #icon v-if="!isImportingResume">
    <Upload class="w-4 h-4" />
  </template>
  导入已有简历
</a-button>
```

#### 2.2 添加状态变量
```typescript
const importResumeOpen = ref(false);
const isImportingResume = ref(false);
```

#### 2.3 添加处理方法
```typescript
const handleImportResume = () => {
  importResumeOpen.value = true;
};

const handleImportResumeSubmit = async (payload: { resumeText: string }) => {
  if (!template.value || isGlobalLoading.value) return;
  isImportingResume.value = true;
  isGlobalLoading.value = true;

  try {
    const { data: resData } = await generateAiResumeAPI({
      parseType: "upload",
      jobDescription: "",  // 无JD
      resumeContent: payload.resumeText,
      templateType: template.value.resume.type,
    });

    if (resData && resData._id) {
      message.success("简历导入成功");
      pushToEditor(resData._id);
      importResumeOpen.value = false;
    }
  } finally {
    isImportingResume.value = false;
    isGlobalLoading.value = false;
  }
};
```

#### 2.4 导入新组件和图标
```typescript
import ImportResumeDialog from "./components/ImportResumeDialog.vue";
import { Upload } from "lucide-vue-next";
```

## 文件修改清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/views/template/components/ImportResumeDialog.vue` | 新建 | 简化版上传简历对话框 |
| `src/views/template/TemplateDetailsPage.vue` | 修改 | 添加按钮、状态和处理逻辑 |

## 按钮布局顺序
1. AI 帮我写（渐变紫色，主要按钮）
2. 立即使用该模板（主要按钮）
3. **导入已有简历**（新增，次要按钮）
4. 返回列表（次要按钮）

## 交互流程
```
用户点击"导入已有简历" → 打开ImportResumeDialog → 
用户上传/粘贴简历内容 → 点击确定 → 
显示全屏加载 → 调用API生成简历 → 跳转编辑器
```
