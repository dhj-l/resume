# 全屏加载组件重构计划

## 目标
使用 Ant Design Vue 提供的 `a-spin` 组件替换 `src/components/common/FullScreenLoading.vue` 中自定义的 CSS 加载动画，以保持 UI 风格统一，同时保留全屏遮罩和交互拦截功能。

## 步骤

1.  **修改 `src/components/common/FullScreenLoading.vue`**
    -   保留 `<Teleport>` 和全屏遮罩层 (`fixed inset-0 bg-black/60`)。
    -   移除原有的自定义旋转动画 HTML 结构。
    -   引入一个白色背景容器（Card 样式），用于承载加载指示器和文本，确保在深色遮罩上清晰可见。
    -   在容器内部使用 `<a-spin size="large" />` 组件。
    -   调整文本样式，使其适配白色背景（深色文字）。
    -   保留原有的按键拦截（F5, Esc）、防刷新 (`beforeunload`) 和超时自动关闭逻辑。

## 预期效果
-   加载时显示全屏半透明遮罩。
-   屏幕中央显示一个白色卡片，包含 Ant Design Vue 风格的加载圈和提示文本。
-   用户无法操作页面其他元素，无法通过键盘快捷键刷新或关闭。
