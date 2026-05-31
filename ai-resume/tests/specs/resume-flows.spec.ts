/**
 * 登录后 — 简历制作流程 E2E 测试
 */

import { expect, test } from "@playwright/test";

import { injectAuthToPage, setupApiMocks } from "../mocks/api";

test.describe("登录后 — 我的简历列表", () => {
  test.beforeEach(async ({ page }) => {
    await injectAuthToPage(page);
    await setupApiMocks(page);
  });

  test("① 我的简历列表加载", async ({ page }) => {
    await page.goto("/user/resumes");
    await expect(page.locator("h1")).toHaveText("我的简历");
    await expect(page.locator("text=管理你创建的简历")).toBeVisible({ timeout: 10000 });
  });

  test("② 从导航栏我的简历链接正确跳转", async ({ page }) => {
    await page.goto("/home");
    const link = page.locator("text=我的简历").first();
    if (await link.isVisible()) {
      await link.click();
      await page.waitForURL("**/user/resumes", { timeout: 10000 });
      await expect(page.locator("h1")).toHaveText("我的简历");
    }
  });
});

test.describe("登录后 — 编辑器页面", () => {
  test.beforeEach(async ({ page }) => {
    await injectAuthToPage(page);
    await setupApiMocks(page);
  });

  test("③ 编辑器页面加载", async ({ page }) => {
    await page.goto("/editor?id=resume001");
    await page.waitForTimeout(3000);
    await expect(page).not.toHaveURL(/\/auth\/login/);
  });
});
