/**
 * Playwright API Mock 拦截器
 *
 * 通过 page.route() 拦截所有 /api/v1/* 请求并返回 mock 响应。
 * 调用 setupApiMocks(page) 在测试的 beforeEach 中注册所有 mock。
 */

import type { Page, Route } from "@playwright/test";

import { SSE_MODULE_KEYS } from "../../src/api/resume-ai/type";

import {
  mockCreatedResume,
  mockGiteeAuthUrl,
  mockLoginResponse,
  mockResumes,
  mockTemplates,
  mockUserProfile,
} from "./data";

/** 标准 API 成功响应包装 */
function apiJson(data: unknown) {
  return {
    code: 200,
    message: "success",
    data,
    timestamp: new Date().toISOString(),
    path: "/api/v1",
  };
}

/** 请求 body 解析 — POST/PATCH/PUT */
function parseBody(route: Route): Record<string, unknown> {
  try {
    const data = route.request().postDataJSON();
    return (data ?? {}) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** 注册所有 API mock */
export async function setupApiMocks(page: Page) {
  // ==================== Auth 模块 ====================

  // 登录
  await page.route("**/api/v1/user/login", async (route) => {
    const body = parseBody(route);
    // 模拟登录验证
    const testEmail = process.env.TEST_USER_EMAIL || "test@example.com";
    const testPassword = process.env.TEST_USER_PASSWORD || "TestPassword123";
    if (body.email === testEmail && body.password === testPassword) {
      await route.fulfill({ json: apiJson(mockLoginResponse) });
    } else {
      await route.fulfill({
        status: 401,
        json: { code: 401, message: "邮箱或密码错误", data: null },
      });
    }
  });

  // 获取用户信息（必须在 /user 通配路由之前注册）
  await page.route("**/api/v1/user/profile", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({ json: apiJson(mockUserProfile) });
    } else if (route.request().method() === "PATCH") {
      await route.fulfill({ json: apiJson(mockUserProfile) });
    } else {
      await route.fulfill({ json: apiJson(mockUserProfile) });
    }
  });

  // 退出登录
  await page.route("**/api/v1/user/logout", async (route) => {
    await route.fulfill({ json: apiJson({}) });
  });

  // 注册（仅精确匹配 /api/v1/user POST，不拦截 profile/logout 等子路径）
  await page.route("**/api/v1/user", async (route) => {
    const url = route.request().url();
    if (url.match(/\/api\/v1\/user(\?.*)?$/)) {
      await route.fulfill({ json: apiJson({}) });
    }
    // 否则让其他 handler 处理
  });

  // Gitee OAuth URL
  await page.route("**/api/v1/auth/gitee", async (route) => {
    await route.fulfill({ json: apiJson(mockGiteeAuthUrl) });
  });

  // GitHub OAuth URL
  await page.route("**/api/v1/auth/github", async (route) => {
    await route.fulfill({
      json: apiJson({ authUrl: "https://github.com/login/oauth/authorize", state: "mock" }),
    });
  });

  // ==================== Templates 模块 ====================

  // 注：更具体的路由必须先注册，否则通配路由会抢先匹配

  // 模板详情 (路径包含 template/:id)
  await page.route(/\/api\/v1\/template\/[^\/]+$/, async (route) => {
    const id = route.request().url().split("/").pop();
    const template = mockTemplates.find((t) => t._id === id) || mockTemplates[0];
    await route.fulfill({ json: apiJson(template) });
  });

  // 模板列表（仅精确匹配 /api/v1/template）
  await page.route("**/api/v1/template", async (route) => {
    // 只处理非详情请求（pathname 恰好以 /template 结尾）
    const url = route.request().url();
    if (url.match(/\/api\/v1\/template(\?.*)?$/)) {
      if (route.request().method() === "GET") {
        await route.fulfill({
          json: apiJson({ list: mockTemplates, total: mockTemplates.length }),
        });
      } else {
        await route.fulfill({ json: apiJson({}) });
      }
    }
    // 否则让其他 handler 处理（已被 detail handler 处理）
  });

  // ==================== Resume 模块 ====================

  // 注：更具体的路由必须先注册，否则通配路由会抢先匹配

  // 简历复制 (最具体：/api/v1/resume/:id/copy)
  await page.route("**/api/v1/resume/*/copy", async (route) => {
    await route.fulfill({
      json: apiJson({
        ...mockResumes[0],
        _id: "resume_copy001",
        title: "张三 - 前端开发工程师(副本)",
      }),
    });
  });

  // 简历详情 / 更新 / 删除 (匹配 /api/v1/resume/:id)
  await page.route(/\/api\/v1\/resume\/[^\/]+$/, async (route) => {
    const id = route.request().url().split("/").pop();
    if (route.request().method() === "GET") {
      await route.fulfill({
        json: apiJson({
          ...mockResumes[0],
          _id: id,
          title: "张三 - 前端开发工程师",
          aiStatus: id === "resume_new" ? "generating" : "",
          type: "default",
          globalStyle: {},
          basicInfo: {
            name: "张三",
            gender: "男",
            phone: "13800138000",
            email: "zhangsan@example.com",
          },
          jobIntention: {},
          educationBackground: [],
          workExperience: [
            {
              companyName: "某公司",
              position: "前端开发工程师",
              workTime: "2020-07",
              dismissalTime: "至今",
              workDescription: "<p>负责核心业务开发</p>",
              globalSort: 1,
              localSort: 1,
            },
          ],
          projectExperience: [],
          campusExperience: [],
          internshipExperience: [],
          skills: { content: "<ul><li>熟练掌握 Vue3</li></ul>" },
          certificates: { content: "" },
          selfEvaluation: { content: "热爱技术" },
        }),
      });
    } else if (route.request().method() === "PATCH") {
      await route.fulfill({ json: apiJson({ ...mockResumes[0] }) });
    } else if (route.request().method() === "DELETE") {
      await route.fulfill({
        json: apiJson({ _id: id, title: "张三 - 前端开发工程师" }),
      });
    } else {
      await route.fulfill({ json: apiJson({}) });
    }
  });

  // 简历列表 / 创建（仅精确匹配 /api/v1/resume，兼容分页 query 参数）
  await page.route(/\/api\/v1\/resume(\?.*)?$/, async (route) => {
    const url = route.request().url();
    if (url.match(/\/api\/v1\/resume(\?.*)?$/)) {
      if (route.request().method() === "GET") {
        await route.fulfill({
          json: apiJson({ list: mockResumes, total: mockResumes.length }),
        });
      } else if (route.request().method() === "POST") {
        await route.fulfill({ json: apiJson(mockCreatedResume) });
      } else {
        await route.fulfill({ json: apiJson({}) });
      }
    }
  });

  // ==================== Resume-AI 模块 (mock minimal) ====================
  // generatesse 由 mockGenerateSse 通过覆盖 window.fetch 实现流式分帧推送

  await page.route("**/api/v1/resume-ai/**", async (route) => {
    await route.fulfill({ json: apiJson({}) });
  });

  // ==================== Upload 模块 ====================

  await page.route("**/api/v1/upload/**", async (route) => {
    await route.fulfill({ json: apiJson({}) });
  });
}

/** 向 localStorage 注入登录态，模拟已登录用户 */
export async function injectAuthToPage(page: Page) {
  const testEmail = process.env.TEST_USER_EMAIL || "test@example.com";
  await page.goto("/");
  await page.evaluate((email) => {
    localStorage.setItem(
      "auth",
      JSON.stringify({
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token",
        userInfo: {
          _id: "user001",
          username: "testuser",
          email,
          createdAt: "2025-01-01T00:00:00Z",
          updatedAt: "2025-06-01T08:00:00Z",
        },
      }),
    );
  }, testEmail);
  // 重新加载以让 Pinia 读取 localStorage
  await page.reload();
}

/**
 * 注册 generatesse 的 SSE mock（流式分帧推送）。
 *
 * 通过 page.addInitScript 覆盖 window.fetch，对 generatesse 请求返回
 * ReadableStream 分帧响应（帧间有延迟，便于 UI 实时渲染进度）。
 * 选择 fetch 覆盖而非 page.route，是因为 route.fulfill 只能一次性返回整个 body，
 * 无法实现真正的流式分帧，会导致 complete 帧与 progress 帧同步到达、遮罩立即关闭，
 * 进度文本来不及渲染。
 *
 * - init(resumeId="resume_new") -> 按请求体 modules 逐模块推送 completed 帧（含 data）-> complete
 * - error:   init -> 第一个模块 completed（含 data）-> error("内容解析异常")
 *
 * 需在 setupApiMocks 之后调用；其他 axios/XHR 请求仍走 page.route mock。
 */
export async function mockGenerateSse(page: Page, scenario: "success" | "error") {
  await page.addInitScript(
    ({ scenario, allModules }: { scenario: "success" | "error"; allModules: string[] }) => {
      const originalFetch = window.fetch;
      window.fetch = async (input: any, init?: any) => {
        const url =
          typeof input === "string"
            ? input
            : input instanceof URL
              ? input.href
              : (input as Request)?.url || "";

        if (!url.includes("/resume-ai/generatesse")) {
          return originalFetch(input as RequestInfo, init as RequestInit);
        }

        const payload = init?.body ? JSON.parse(String(init.body)) : {};
        const modules =
          Array.isArray(payload.modules) && payload.modules.length > 0
            ? payload.modules
            : allModules;
        const total = modules.length;

        const moduleMockData: Record<string, any> = {
          basicInfo: {
            name: "张三",
            gender: "男",
            phone: "13800138000",
            email: "zhangsan@example.com",
          },
          jobIntention: {},
          globalStyle: {},
          skills: { content: "<ul><li>熟练掌握 Vue3</li></ul>" },
          certificates: { content: "" },
          selfEvaluation: { content: "AI 优化的自我评价" },
          educationBackground: [],
          workExperience: [
            {
              companyName: "某公司",
              position: "前端开发工程师",
              workTime: "2020-07",
              dismissalTime: "至今",
              workDescription: "<p>负责 AI 核心业务开发</p>",
              globalSort: 1,
              localSort: 1,
            },
          ],
          projectExperience: [],
          campusExperience: [],
          internshipExperience: [],
        };

        const frames =
          scenario === "success"
            ? [
                {
                  type: "init",
                  moduleName: "system",
                  status: "started",
                  totalModules: total,
                  currentModule: 0,
                  resumeId: "resume_new",
                },
                ...modules.map((moduleName: string, index: number) => ({
                  type: "progress",
                  moduleName,
                  status: "completed",
                  totalModules: total,
                  currentModule: index + 1,
                  resumeId: "resume_new",
                  data: moduleMockData[moduleName] ?? {},
                })),
                {
                  type: "complete",
                  status: "completed",
                  totalModules: total,
                  currentModule: total,
                  resumeId: "resume_new",
                },
              ]
            : [
                {
                  type: "init",
                  moduleName: "system",
                  status: "started",
                  totalModules: total,
                  currentModule: 0,
                  resumeId: "resume_new",
                },
                {
                  type: "progress",
                  moduleName: modules[0],
                  status: "completed",
                  totalModules: total,
                  currentModule: 1,
                  resumeId: "resume_new",
                  data: moduleMockData[modules[0]] ?? {},
                },
                {
                  type: "error",
                  status: "failed",
                  message: "内容解析异常",
                  totalModules: total,
                  currentModule: 1,
                  resumeId: "resume_new",
                },
              ];

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            for (const frame of frames) {
              // 完成帧前保持“生成中 x/x”状态足够时间，便于 E2E 断言进度
              if (frame.type === "complete") {
                await new Promise((resolve) => setTimeout(resolve, 4000));
              }
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(frame)}\n\n`));
              if (frame.type !== "complete") {
                // 帧间延迟，让 UI 有机会渲染进度
                await new Promise((resolve) => setTimeout(resolve, 600));
              }
            }
            controller.close();
          },
        });

        return new Response(stream, {
          status: 200,
          headers: { "Content-Type": "text/event-stream" },
        });
      };
    },
    { scenario, allModules: SSE_MODULE_KEYS },
  );
}
