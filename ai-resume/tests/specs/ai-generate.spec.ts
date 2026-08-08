/**
 * 模板详情 - AI 生成简历 SSE 实时进度 E2E 测试
 */

import { expect, test, type Page } from "@playwright/test";

import { injectAuthToPage, mockGenerateSse, setupApiMocks } from "../mocks/api";

/**
 * 走"手动输入"路径提交 AI 生成：填 JD -> 基本资料 -> 开始生成
 */
async function submitManualGenerate(page: Page) {
  // 步骤 1：职位描述
  await page.getByPlaceholder(/请粘贴职位描述/).fill("前端工程师，精通 Vue3 和 TypeScript");
  await page.getByRole("button", { name: "下一步" }).click();

  // 步骤 2：基本资料（姓名、目标岗位、学历、院校为必填）
  await page.getByPlaceholder("您的姓名").fill("张三");
  await page.getByPlaceholder("例如：前端工程师").fill("前端工程师");
  await page.locator(".ant-select").first().click();
  await page.getByTitle("本科").click();
  await page.getByPlaceholder("学校名称").fill("测试大学");
  await page.getByRole("button", { name: "下一步" }).click();

  // 步骤 3：补充信息可空，直接开始生成
  await page.getByRole("button", { name: "开始生成" }).click();
}

test.describe("模板详情 - AI 生成简历", () => {
  test.beforeEach(async ({ page }) => {
    await injectAuthToPage(page);
    await setupApiMocks(page);
  });

  test("成功流：显示实时进度并跳转编辑页", async ({ page }) => {
    await mockGenerateSse(page, "success");
    await page.goto("/templates/tpl001default");

    await expect(page.getByRole("button", { name: "AI 帮我写" })).toBeVisible();
    await page.getByRole("button", { name: "AI 帮我写" }).click();

    await expect(page.getByText("手动输入", { exact: true })).toBeVisible();
    await page.getByText("手动输入", { exact: true }).click();

    await submitManualGenerate(page);

    // 进度文本出现
    await expect(page.getByText("正在生成")).toBeVisible({ timeout: 10000 });
    // 进度更新到第二帧（2/11）
    await expect(page.getByText("2/11")).toBeVisible({ timeout: 10000 });
    // 完成后跳转编辑页
    await page.waitForURL("**/editor?id=resume_new", { timeout: 10000 });
  });

  test("失败流：推送 error 后显示错误提示并关闭遮罩", async ({ page }) => {
    await mockGenerateSse(page, "error");
    await page.goto("/templates/tpl001default");

    await expect(page.getByRole("button", { name: "AI 帮我写" })).toBeVisible();
    await page.getByRole("button", { name: "AI 帮我写" }).click();

    await expect(page.getByText("手动输入", { exact: true })).toBeVisible();
    await page.getByText("手动输入", { exact: true }).click();

    await submitManualGenerate(page);

    // 错误提示出现
    await expect(page.getByText("AI 生成失败：内容解析异常")).toBeVisible({ timeout: 10000 });
    // 遮罩关闭（FullScreenLoading 移除）
    await expect(page.getByText("请勿关闭页面或刷新")).toBeHidden({ timeout: 10000 });
  });
});
