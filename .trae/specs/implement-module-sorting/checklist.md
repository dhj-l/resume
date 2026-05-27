# 验证清单

## 类型定义验证

- [x] ModuleItem 接口包含 globalSort 字段

## 模块排序验证

- [x] moduleOrder 配置包含 globalSort 字段
- [x] sortedModuleOrder 计算属性正确按 globalSort 排序
- [x] 模块列表初始顺序正确

## 模块交换功能验证

- [x] swapModuleOrder 函数正确互换两个模块的 globalSort 值
- [x] 交换后模块列表顺序正确更新
- [x] 交换操作不影响其他模块

## 代码清理验证

- [x] 移除不需要的数据项排序代码
- [x] 代码整洁无冗余

## 功能测试验证

- [x] 模块列表按 globalSort 正确排序
- [x] 交换两个模块位置后顺序正确
- [x] UI 正确反映排序后的模块顺序
