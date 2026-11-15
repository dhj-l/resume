# 模拟面试页面美化方案(DeepSeek 式对话布局)

## 目标与设计基调

将模拟面试三个页面(发起页 / 对话页 / 报告页)统一升级为 AI 紫渐变风格,对话页参考 DeepSeek 官网布局:**左侧侧边栏展示面试记录列表(可折叠),右侧为当前对话区**;无会话时右侧显示 DeepSeek 式欢迎页(居中标语 + 考察侧重胶囊 + 引导)。

- 配色:统一 indigo→violet AI 紫渐变(#6366f1→#8b5cf6),不再散落硬编码 hex;与全站 `ai: #722ed1` 的 AI 功能紫呼应
- 整体气质:浅色极简、大量留白、毛玻璃、柔光渐变背景,复用项目现有惯例(Tailwind 原子类 + shadow-card + hover 上浮 + backdrop-blur)

## 前置步骤:查找美化 skill

按用户要求,实施第一步调用 `find-skills` 查找前端美化类 skill;找到则安装并按其规范执行,找不到则按本计划执行。

## 文件改动清单

### 1. API 层(先 mock,接口就绪后切换)
- `src/api/interview/type.ts`:新增 `InterviewSessionSummary`(列表项:id、JD 标题、focus、status、轮数、是否已生成报告、开始/最近活动时间)
- `src/api/interview/interview.ts`:新增 `getSessionListAPI(params)` → `GET /interview/sessions`(分页),按现有接口文档风格定义
- `src/api/interview/mock.ts`(新):用常量开关 `USE_SESSION_LIST_MOCK = true` 控制;提供 8~10 条真实感 mock 记录(1 条进行中、多条已完成/已放弃,分布在不同时间段)及配套的 mock 会话详情(含完整 messages,供只读回放),mock id 加前缀 `mock-` 便于识别

### 2. 状态层
- `src/stores/interviewStore.ts`(新,Pinia):会话列表 + 列表加载态 + 侧边栏折叠状态(持久化 localStorage);`loadSession(id)` 封装:mock id 走 mock 详情,真实 id 走 `getSessionDetailAPI`

### 3. 对话页重构(核心)
- `src/views/interview/components/InterviewSidebar.vue`(新):
  - 顶部品牌行("AI 模拟面试" + 折叠按钮)→「发起新面试」渐变胶囊按钮(跳 /interview)
  - 记录分组:**进行中**(呼吸绿点)/ **已结束**;每项显示 JD 标题截断、`N/M 轮 · 相对时间`、状态色点;hover 高亮、当前项紫浅底选中态
  - 底部「返回首页」;桌面端可折叠收起(宽度过渡),移动端为覆盖式抽屉 + 遮罩
- `InterviewChatPage.vue` 重构为 DeepSeek 双栏布局,保留全部现有逻辑(SSE 提交、乐观渲染与回滚、打字机、倒计时、收尾/放弃、错误处理):
  - 支持无 `?id` 进入:右侧显示欢迎页(居中渐变标语「随时开始,准备充分再上场」+ 技术面/项目面/综合面三个胶囊,点击带 `?focus=` 跳发起页)
  - 点击侧边栏记录:进行中 → 正常对话;已完成/已放弃 → **只读回放模式**(加载该会话 messages 渲染,输入区替换为「查看评价报告」按钮,无报告则显示说明)
  - 顶栏极简化:侧栏开关 + 标题/侧重 + 轮次进度条 + 倒计时 + 收尾/放弃;已考察主题改收纳进「考察进度」Popover(展示完整 outline 与已考察状态),替代现在顶部一排 Tag
  - 消息气泡、头像、AI 思考点、打字机光标全部按新配色精修;输入区参考 DeepSeek:大圆角卡片、左下提示文案、右下圆形渐变发送按钮
- 路由 `meta.title` 保持不变,`/interview/chat` 不再强制要求 id

### 4. 发起页美化(逻辑不动)
- `InterviewSetupPage.vue`:三步式视觉引导(01 选简历 → 02 描述岗位 → 03 面试策略),经验层级/考察侧重选择卡片选中态强化(紫渐变描边 + 角标),支持 `?focus=` 预选;开始按钮渐变 + loading;进行中会话恢复横幅样式精修

### 5. 报告页美化
- `InterviewReportPage.vue`:配色统一为紫调;总览卡精修(分数环渐变描边 + 推荐结论大徽章);**新增主题得分雷达图**(复用项目已有的 vue-echarts,参考 `src/components/resume-analysis/RadarChart.vue`);优势/不足/建议三列卡片配 lucide 图标与彩色顶边;问答回顾 Collapse 精修(轮次徽章、问/答排版、未答提示)

## 实施顺序

1. find-skills 查找美化 skill(有则用)
2. API 类型 + mock + interviewStore
3. InterviewSidebar 组件
4. ChatPage 双栏重构(欢迎页、只读回放、Popover 大纲)
5. SetupPage 美化 → ReportPage 美化
6. 验证与收尾

## 验证

- `pnpm lint`、`pnpm build`(含 vue-tsc 类型检查)
- `pnpm dev` + 浏览器逐页截图自查:侧边栏(mock 列表)、欢迎空态、只读回放、发起页、报告页(mock 报告数据拦截);必要时用浏览器脚本拦截接口返回 mock 数据
- 面试页无现有 E2E spec,不会破坏 CI;时间允许则补一个基础冒烟 spec(mock 列表/详情/SSE)

## 不改动范围

- 后端接口与 SSE 协议不动;`submitAnswerSSE`、倒计时、错误回滚等交互逻辑原样保留
- 不引入 Markdown 渲染库(面试题为纯文本,维持 `whitespace-pre-wrap` 渲染与项目现状一致)
- 不动 `tests/` 现有 spec 与编辑器/AI 押题模块