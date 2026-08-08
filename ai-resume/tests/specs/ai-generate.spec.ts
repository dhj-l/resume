/**
 * 模板详情 - AI 生成简历 SSE 实时进度 E2E 测试
 */

import { expect, test, type Page } from "@playwright/test";

import { injectAuthToPage, mockGenerateSse, setupApiMocks } from "../mocks/api";

/**
 * 走"手动输入"路径提交 AI 生成：
 * 填 JD -> 基本资料 -> 补充信息 -> 选择模块 -> 开始生成
 * uncheckModules 用于取消勾选指定中文名的模块（默认全选；基础信息/求职意向为固定模块，不可取消）。
 */
async function submitManualGenerate(page: Page, options?: { uncheckModules?: string[] }) {
  // 步骤 1：职位描述
  await page.getByPlaceholder(/请粘贴职位描述/).fill("前端工程师，精通 Vue3 和 TypeScript");
  await page.getByRole("button", { name: "下一步" }).click();

  // 步骤 2：基本资料（姓名、目标岗位、学历、院校为必填）
  await page.getByPlaceholder("您的姓名").fill("张三");
  await page.getByPlaceholder("例如：前端工程师").fill("前端工程师");
  await page.locator(".ant-select").first().click();
  await page
    .locator(".ant-select-dropdown .ant-select-item-option-content", {
      hasText: "本科",
    })
    .click();
  await page.getByPlaceholder("学校名称").fill("测试大学");
  await page.getByRole("button", { name: "下一步" }).click();

  // 步骤 3：补充信息可空，进入模块选择
  await page.getByRole("button", { name: "下一步" }).click();

  // 步骤 4：模块选择（默认全选；可取消指定模块）
  const modal = page.locator(".ai-create-modal");
  for (const label of options?.uncheckModules ?? []) {
    await modal.getByText(label, { exact: true }).click();
  }

  // 固定模块（求职意向）不可取消：保持勾选且处于禁用态
  const jobIntentionWrapper = modal.locator(".ant-checkbox-wrapper", {
    hasText: "求职意向",
  });
  await expect(jobIntentionWrapper).toHaveClass(/ant-checkbox-wrapper-disabled/);
  await expect(jobIntentionWrapper.locator(".ant-checkbox-checked")).toBeVisible();

  // 开始生成
  await page.getByRole("button", { name: "开始生成" }).click();
}

test.describe("模板详情 - AI 生成简历", () => {
  test.beforeEach(async ({ page }) => {
    await injectAuthToPage(page);
    await setupApiMocks(page);
  });

  test("成功流：init 后进入编辑页，模块内容实时渲染并完成解锁", async ({ page }) => {
    await mockGenerateSse(page, "success");
    await page.goto("/templates/tpl001default");

    await expect(page.getByRole("button", { name: "AI 帮我写" })).toBeVisible();
    await page.getByRole("button", { name: "AI 帮我写" }).click();

    await expect(page.getByText("手动输入", { exact: true })).toBeVisible();
    await page.getByText("手动输入", { exact: true }).click();

    await submitManualGenerate(page);

    // init 后立即进入编辑页
    await page.waitForURL("**/editor?id=resume_new", { timeout: 10000 });
    // 生成中横幅与进度实时更新
    await expect(page.getByText(/AI 生成中：1\/11/)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/AI 生成中：2\/11/)).toBeVisible({ timeout: 10000 });
    // 预览区标注当前生成的模块（模块名随进度实时变化）
    await expect(page.getByText(/AI 正在生成：/)).toBeVisible({
      timeout: 10000,
    });
    // 模块数据实时渲染到预览（basicInfo 姓名）
    await expect(page.getByText("张三", { exact: true }).first()).toBeVisible({
      timeout: 10000,
    });
    // 生成中保存按钮禁用
    await expect(page.getByRole("button", { name: "保存草稿" })).toBeDisabled();
    // 完成后横幅切换并解锁
    await expect(page.getByText("AI 生成完成，可以开始编辑了")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByRole("button", { name: "保存草稿" })).toBeEnabled();
  });

  test("失败流：保留已生成内容并提示失败", async ({ page }) => {
    await mockGenerateSse(page, "error");
    await page.goto("/templates/tpl001default");

    await expect(page.getByRole("button", { name: "AI 帮我写" })).toBeVisible();
    await page.getByRole("button", { name: "AI 帮我写" }).click();

    await expect(page.getByText("手动输入", { exact: true })).toBeVisible();
    await page.getByText("手动输入", { exact: true }).click();

    await submitManualGenerate(page);

    // init 后进入编辑页
    await page.waitForURL("**/editor?id=resume_new", { timeout: 10000 });
    // 已生成模块内容保留在预览
    await expect(page.getByText("张三", { exact: true }).first()).toBeVisible({
      timeout: 10000,
    });
    // 失败横幅出现
    await expect(page.getByText("AI 生成失败：内容解析异常")).toBeVisible({
      timeout: 10000,
    });
    // 失败后解锁编辑
    await expect(page.getByRole("button", { name: "保存草稿" })).toBeEnabled();
  });

  test("部分模块：固定模块保留，只勾选 3 个模块时进度总数正确并跳转编辑页", async ({ page }) => {
    await mockGenerateSse(page, "success");
    await page.goto("/templates/tpl001default");

    await expect(page.getByRole("button", { name: "AI 帮我写" })).toBeVisible();
    await page.getByRole("button", { name: "AI 帮我写" }).click();

    await expect(page.getByText("手动输入", { exact: true })).toBeVisible();
    await page.getByText("手动输入", { exact: true }).click();

    // 固定保留 基础信息 + 求职意向，只额外保留 工作经历，其余全部取消
    await submitManualGenerate(page, {
      uncheckModules: [
        "全局样式",
        "技能",
        "证书",
        "自我评价",
        "教育经历",
        "项目经历",
        "校园经历",
        "实习经历",
      ],
    });

    // init 后进入编辑页，进度总数按所选模块数动态展示
    await page.waitForURL("**/editor?id=resume_new", { timeout: 10000 });
    await expect(page.getByText(/AI 生成中：1\/3/)).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText(/AI 生成中：2\/3/)).toBeVisible({ timeout: 10000 });
    // 只渲染所选模块的数据（工作经历公司名）
    await expect(page.getByText("某公司", { exact: true }).first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("AI 生成完成，可以开始编辑了")).toBeVisible({
      timeout: 10000,
    });
  });
});
