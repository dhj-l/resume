/**
 * 编辑器右侧 AI 抽屉互斥 E2E 测试
 *
 * 回归场景：先打开「AI 分析」抽屉，再点击「AI 押题」时，
 * 两个抽屉同时只能展示一个，新的抽屉必须关闭旧的抽屉。
 */

import { expect, test } from "@playwright/test";

import { injectAuthToPage, setupApiMocks } from "../mocks/api";

test.describe("编辑器 AI 抽屉互斥", () => {
  test.beforeEach(async ({ page }) => {
    await injectAuthToPage(page);
    await setupApiMocks(page);
  });

  test("AI 分析与 AI 押题抽屉同时只能展示一个", async ({ page }) => {
    await page.goto("/editor?id=resume001");

    const analysisButton = page.getByRole("button", { name: "AI分析" });
    const questionsButton = page.getByRole("button", { name: "AI押题" });
    // 抽屉标题带空格，按钮文案不带空格，避免选择器互相命中
    const analysisTitle = page.getByText("AI 分析", { exact: true });
    const questionsTitle = page.getByText("AI 押题", { exact: true });

    // 初始：两个抽屉都未进入视口
    await expect(analysisTitle).not.toBeInViewport();
    await expect(questionsTitle).not.toBeInViewport();

    // 打开 AI 分析
    await analysisButton.click();
    await expect(analysisTitle).toBeInViewport();
    await expect(questionsTitle).not.toBeInViewport();

    // 再打开 AI 押题：AI 分析抽屉必须被关闭，不能同时展示
    await questionsButton.click();
    await expect(questionsTitle).toBeInViewport();
    await expect(analysisTitle).not.toBeInViewport();

    // 切回 AI 分析：AI 押题抽屉必须被关闭
    await analysisButton.click();
    await expect(analysisTitle).toBeInViewport();
    await expect(questionsTitle).not.toBeInViewport();

    // 再次点击当前打开的按钮可关闭抽屉
    await analysisButton.click();
    await expect(analysisTitle).not.toBeInViewport();
  });
});
