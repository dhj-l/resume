/**
 * AI 押题详情页内容展示 E2E 测试
 *
 * 覆盖：头部元信息、记录级汇总卡片（综合说明/重点方向/高频考点/备战建议）、
 * 题目扩展字段（关键词/考察点/追问）。
 */

import { expect, test } from "@playwright/test";

import { injectAuthToPage, setupApiMocks } from "../mocks/api";

test.describe("AI 押题详情页", () => {
  test.beforeEach(async ({ page }) => {
    await injectAuthToPage(page);
    await setupApiMocks(page);
  });

  test("展示汇总卡片、题目详情与扩展字段", async ({ page }) => {
    await page.goto("/question-detail?id=qdetail001");

    // 头部与元信息
    await expect(page.getByText("AI 押题详情", { exact: true })).toBeVisible();
    await expect(
      page.getByText("张三 · 前端开发工程师 · 3年", { exact: true }),
    ).toBeVisible();

    // 内容宽度应与屏幕宽度接近（全宽布局）
    const contentBox = await page.locator("div.bg-white.rounded-lg.p-6").boundingBox();
    const viewport = page.viewportSize();
    expect(contentBox?.width ?? 0).toBeGreaterThanOrEqual((viewport?.width ?? 0) - 80);

    // 记录级汇总卡片
    await expect(page.getByText("综合押题说明", { exact: true })).toBeVisible();
    await expect(page.getByText("重点准备方向", { exact: true })).toBeVisible();
    await expect(page.getByText("行业高频考点", { exact: true })).toBeVisible();
    await expect(page.getByText("备战建议", { exact: true })).toBeVisible();

    // 题目与扩展字段
    await expect(page.getByText("押题清单", { exact: true })).toBeVisible();
    const questionCard = page.getByRole("button", {
      name: /请描述 Vue3 响应式原理的优化实践/,
    });
    await expect(questionCard).toBeVisible();
    await expect(
      page.getByText("Vue3 响应式", { exact: true }).first(),
    ).toBeVisible();
    await questionCard.click();
    await expect(page.getByText("考察点", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("可能的追问", { exact: true }).first()).toBeVisible();
    await expect(
      page.getByText("如果数据量继续增长，你会如何进一步优化？", {
        exact: true,
      }),
    ).toBeVisible();
  });
});
