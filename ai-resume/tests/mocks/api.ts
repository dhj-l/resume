/**
 * Playwright API Mock 拦截器
 *
 * 通过 page.route() 拦截所有 /api/v1/* 请求并返回 mock 响应。
 * 调用 setupApiMocks(page) 在测试的 beforeEach 中注册所有 mock。
 */

import type { Page, Route } from "@playwright/test";

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
    await route.fulfill({ json: apiJson({ authUrl: "https://github.com/login/oauth/authorize", state: "mock" }) });
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
    await route.fulfill({ json: apiJson({ ...mockResumes[0], _id: "resume_copy001", title: "张三 - 前端开发工程师(副本)" }) });
  });

  // 简历详情 / 更新 / 删除 (匹配 /api/v1/resume/:id)
  await page.route(/\/api\/v1\/resume\/[^\/]+$/, async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({ json: apiJson({ ...mockResumes[0], title: "前端开发工程师简历详情" }) });
    } else if (route.request().method() === "PATCH") {
      await route.fulfill({ json: apiJson({ ...mockResumes[0] }) });
    } else if (route.request().method() === "DELETE") {
      await route.fulfill({ json: apiJson({ _id: "resume001", title: "张三 - 前端开发工程师" }) });
    } else {
      await route.fulfill({ json: apiJson({}) });
    }
  });

  // 简历列表 / 创建（仅精确匹配 /api/v1/resume）
  await page.route("**/api/v1/resume", async (route) => {
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
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem(
      "auth",
      JSON.stringify({
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token",
        userInfo: {
          _id: "user001",
          username: "testuser",
          email: process.env.TEST_USER_EMAIL || "test@example.com",
          createdAt: "2025-01-01T00:00:00Z",
          updatedAt: "2025-06-01T08:00:00Z",
        },
      }),
    );
  });
  // 重新加载以让 Pinia 读取 localStorage
  await page.reload();
}
