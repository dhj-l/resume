import html2canvas from "html2canvas";

export const extractEffectiveCssForElement = (element: Element) => {
  const matchedCss = [];

  // 遍历所有样式表
  for (const styleSheet of document.styleSheets) {
    let rules;
    try {
      rules = styleSheet.cssRules;
    } catch (e) {
      // 忽略跨域的 stylesheet
      continue;
    }

    if (!rules) continue;

    for (const rule of rules) {
      if (rule.type === CSSRule.STYLE_RULE) {
        const selectorText = (rule as CSSStyleRule).selectorText;

        // 过滤掉 shadow 相关的类名
        if (selectorText.includes("shadow")) continue;

        // 判断这个选择器是否命中目标元素或其子元素
        try {
          // 检查是否命中当前元素
          if (element.matches(selectorText)) {
            matchedCss.push(rule.cssText);
            continue;
          }

          // 检查是否命中子元素
          if (element.querySelectorAll(selectorText).length > 0) {
            matchedCss.push(rule.cssText);
          }
        } catch (e) {
          // 有些选择器解析会报错，比如 ::-webkit-scrollbar，跳过即可
          continue;
        }
      }
    }
  }

  return matchedCss.join("\n");
};
/**
 * 接收一个dom元素，获取这个dom元素下(包括本身)所有的dom,返回一个字符串
 */
export const getDomHtml = (dom: Element) => {
  return dom.outerHTML;
};

export const getElement = (className: string) => {
  return document.querySelector(className);
};

export const getDomCover = async (elemet: HTMLElement) => {
  const cover = await html2canvas(elemet, {
    scale: 2,
    useCORS: true,
  });
  const coverImg = await new Promise((resolve) => {
    cover.toBlob(resolve, "image/png", 1.0);
  });
  const file = new File([coverImg as BlobPart], "cover.png", {
    type: "image/png",
  });
  console.log(file);

  return file;
  // cover.toBlob((blob) => {});
};
