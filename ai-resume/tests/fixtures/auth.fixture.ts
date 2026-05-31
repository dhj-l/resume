/**
 * Auth 夹具 — 提供已认证的测试上下文
 *
 * 使用方式：
 *   import { test } from "../fixtures/auth.fixture";
 *   test("已登录页面测试", async ({ authenticatedPage }) => { ... });
 */

import { test as base, type Page } from "@playwright/test";

import { setupApiMocks, injectAuthToPage } from "../mocks/api";

/** 已认证的 Page fixture */
type AuthenticatedFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthenticatedFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // 注入登录态
    await injectAuthToPage(page);
    // 注册 API mock
    await setupApiMocks(page);
    await use(page);
  },
});

export { expect } from "@playwright/test";
