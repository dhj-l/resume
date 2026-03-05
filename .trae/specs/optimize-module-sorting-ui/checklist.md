# 验证清单

## UI 交互验证

- [x] 排序按钮已从上下箭头改为左右箭头
- [x] 按钮布局为：左箭头 | label | 右箭头
- [x] 按钮悬停时显示主题蓝色
- [x] 禁用按钮显示灰色且不可点击
- [x] 固定模块（basicInfo、jobIntention）不显示排序按钮

## 数据持久化验证

- [x] `resumeStore.ts` 中存在数据同步实现（在 swapModuleOrder 中）
- [x] 排序操作后 `resumeData.moduleOrderConfig` 正确更新
- [x] `moduleOrderConfig` 数据格式符合 `ModuleOrderConfig` 接口
- [x] 数据包含所有模块的 `moduleKey` 和 `globalSort`

## 代码质量验证

- [x] TypeScript 类型检查通过
- [x] 代码整洁无冗余
- [x] 无 console.log 调试代码残留
