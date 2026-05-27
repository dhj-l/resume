<template>
  <div>
    <div>
      <Toolbar :editor="editorRef" :default-config="toolbarConfig" />
      <Editor
        v-model="valueHtml"
        :default-config="editorConfig"
        style="height: 301px; overflow-y: hidden; border-top: 1px solid #e5e5e5"
        @on-created="handleCreated"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import "@wangeditor/editor/dist/css/style.css";
import { onBeforeUnmount, shallowRef } from "vue";

import type { IToolbarConfig } from "@wangeditor/editor";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = defineModel({
  default: "<p>hello</p>",
});

const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: [
    "fullScreen",
    "insertTable",
    "group-video",
    "group-image",
    "codeBlock",
    "emotion",
    "todo",
  ],
};
const editorConfig = { placeholder: "请输入内容..." };

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;

  editor.destroy();
});
</script>
