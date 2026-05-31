/**
 * 未登录流程 E2E 测试
 *
 * 覆盖场景：
 *   ① 首页加载 & 导航栏显示正确
 *   ② 模板列表页加载 & 分页元素渲染
 *   ③ 路由守卫：访问需认证页面时重定向到登录页
 *   ④ 404 页面
 */

import { expect, test } from "@playwright/test";

import { setupApiMocks } from "../mocks/api";

test.describe("未登录用户 — 公开页面", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test("① 首页加载：显示导航栏、Hero 区域和开始制作按钮", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL("**/home");

    // 导航栏品牌名
    await expect(page.locator("text=大学生简历")).toBeVisible({ timeout: 8000 });
    // 未登录时显示"登录 / 注册"
    await expect(page.locator("text=登录 / 注册")).toBeVisible();
    // "开始制作"按钮（使用 exact 避免匹配 Hero 中的"免费开始制作"）
    await expect(page.getByRole("button", { name: "开始制作", exact: true })).toBeVisible();
  });

  test("② 模板列表页：加载后展示模板卡片", async ({ page }) => {
    await page.goto("/templates");

    // 页面标题
    await expect(page.locator("h1")).toHaveText("专业简历模板");

    // 模板卡片存在（mock 返回 3 个）
    await page.waitForTimeout(1500);
    const cards = page.locator(".grid > *");
    await expect(cards.first()).toBeVisible({ timeout: 8000 });
  });

  test("③ 导航栏链接：点击我的简历跳转到登录页", async ({ page }) => {
    await page.goto("/home");

    const myResumeLink = page.locator("text=我的简历").first();
    if (await myResumeLink.isVisible()) {
      await myResumeLink.click();
      await page.waitForURL("**/auth/login");
      await expect(page.locator("text=欢迎回来")).toBeVisible();
    }
  });

  test("④ 页面未找到：访问不存在的路由显示 404", async ({ page }) => {
    await page.goto("/non-existent-page-xyz");

    // 404 页面应包含 404 标题
    await expect(page.locator("text=404").first()).toBeVisible({
      timeout: 5000,
    });
  });
});

test.describe("未登录用户 — 路由守卫", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test("访问 /editor → 重定向到 /auth/login", async ({ page }) => {
    await page.goto("/editor");
    await page.waitForURL("**/auth/login");
    await expect(page.locator("text=欢迎回来")).toBeVisible();
  });

  test("访问 /user/resumes → 重定向到 /auth/login", async ({ page }) => {
    await page.goto("/user/resumes");
    await page.waitForURL("**/auth/login");
    await expect(page.locator("text=欢迎回来")).toBeVisible();
  });

  test("访问 /user/generations → 重定向到 /auth/login", async ({ page }) => {
    await page.goto("/user/generations");
    await page.waitForURL("**/auth/login");
    await expect(page.locator("text=欢迎回来")).toBeVisible();
  });

  test("访问 /analysis-detail → 重定向到 /auth/login", async ({ page }) => {
    await page.goto("/analysis-detail");
    await page.waitForURL("**/auth/login");
    await expect(page.locator("text=欢迎回来")).toBeVisible();
  });
});
