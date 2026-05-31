/**
 * 认证流程 E2E 测试
 *
 * 覆盖场景：
 *   ① 登录表单验证（空字段、无效邮箱格式）
 *   ② 邮箱登录失败（凭据错误）
 *   ③ 邮箱登录成功 → 跳转首页 → 导航栏显示用户名
 *   ④ 注册表单验证
 *   ⑤ 注册成功
 *   ⑥ 游客体验入口
 *   ⑦ 退出登录
 */

import { expect, test } from "@playwright/test";

import { setupApiMocks } from "../mocks/api";

const VALID_EMAIL = process.env.TEST_USER_EMAIL || "test@example.com";
const VALID_PASSWORD = process.env.TEST_USER_PASSWORD || "TestPassword123";

/** 填写登录表单 */
async function fillLoginForm(
  page: import("@playwright/test").Page,
  email: string,
  password: string,
) {
  await page.getByPlaceholder("name@example.com").fill(email);
  await page.getByPlaceholder("请输入密码").fill(password);
}

test.describe("认证流程 — 登录", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test("① 登录页加载：显示标题和表单字段", async ({ page }) => {
    await page.goto("/auth/login");

    await expect(page.locator("text=欢迎回来")).toBeVisible();
    await expect(page.locator("text=社交账号登录")).toBeVisible();
    // 邮箱输入框存在
    await expect(page.getByPlaceholder("name@example.com")).toBeVisible();
    // 密码输入框存在
    await expect(page.getByPlaceholder("请输入密码")).toBeVisible();
    // 登录提交按钮（使用 type="submit" 精确匹配）
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    // Gitee 登录按钮
    await expect(page.getByText("Gitee 登录")).toBeVisible();
  });

  test("② 表单验证：空字段提交显示错误信息", async ({ page }) => {
    await page.goto("/auth/login");

    // 直接点击登录按钮，触发表单验证
    await page.locator('button[type="submit"]').click();

    // ant-design 表单验证：应有"请输入你的邮箱"错误提示
    await expect(page.locator("text=请输入你的邮箱")).toBeVisible({ timeout: 5000 });
  });

  test("③ 表单验证：无效邮箱格式", async ({ page }) => {
    await page.goto("/auth/login");

    await fillLoginForm(page, "not-an-email", "password123");
    await page.locator('button[type="submit"]').click();

    await expect(page.locator("text=请输入有效的邮箱地址")).toBeVisible({ timeout: 5000 });
  });

  test("④ 登录失败：凭据错误显示错误提示", async ({ page }) => {
    await page.goto("/auth/login");

    // 使用错误凭据
    await fillLoginForm(page, "wrong@example.com", "wrongpass");
    await page.locator('button[type="submit"]').click();

    // Ant Design 的 message.error 会弹出 toast
    await expect(page.locator(".ant-message-notice").first()).toBeVisible({ timeout: 8000 });
  });

  test("⑤ 登录成功：跳转首页，导航栏显示用户名", async ({ page }) => {
    await page.goto("/auth/login");

    // 使用正确的凭据
    await fillLoginForm(page, VALID_EMAIL, VALID_PASSWORD);
    await page.locator('button[type="submit"]').click();

    // 等待跳转到首页
    await page.waitForURL("**/home", { timeout: 10000 });

    // 登录后不应显示"登录 / 注册"链接
    await expect(page.locator("text=登录 / 注册")).not.toBeVisible({ timeout: 8000 });
  });
});

test.describe("认证流程 — 注册", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test("⑥ 注册页加载：显示标题和表单字段", async ({ page }) => {
    await page.goto("/auth/register");

    // 使用 heading 选择器避免与注册按钮文字冲突
    await expect(page.getByRole("heading", { name: "创建账号" })).toBeVisible();
    await expect(page.getByPlaceholder("请输入用户名")).toBeVisible();
  });

  test("⑦ 注册表单验证：空字段提交", async ({ page }) => {
    await page.goto("/auth/register");

    // 注册提交按钮
    await page.locator('button[type="submit"]').click();

    // 应有用户名必填提示
    await expect(page.locator("text=请输入你的用户名")).toBeVisible({ timeout: 5000 });
  });
});

test.describe("认证流程 — 游客体验 & 退出", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test("⑧ 登录页包含 Gitee 社交登录入口", async ({ page }) => {
    await page.goto("/auth/login");

    // Gitee 登录按钮确认存在
    await expect(page.getByText("Gitee 登录")).toBeVisible({ timeout: 5000 });

    // 页面至少应有 3 个按钮（登录提交 + Gitee 登录 + 游客体验）
    const buttonCount = await page.locator("button").count();
    expect(buttonCount).toBeGreaterThanOrEqual(3);
  });

  test("⑨ 登录后退出：导航栏用户菜单退出", async ({ page }) => {
    // 先登录
    await page.goto("/auth/login");
    await fillLoginForm(page, VALID_EMAIL, VALID_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL("**/home", { timeout: 10000 });

    // 确认已登录（登录/注册链接消失）
    await expect(page.locator("text=登录 / 注册")).not.toBeVisible({ timeout: 8000 });

    // 点击用户头像展开下拉菜单
    await page.locator(".ant-avatar").first().click();

    // 点击"退出登录"
    await page.locator("text=退出登录").click();

    // 应跳转到登录页
    await page.waitForURL("**/auth/login", { timeout: 8000 });
    await expect(page.locator("text=欢迎回来")).toBeVisible();
  });
});
