import html2canvas from "html2canvas";

export const extractEffectiveCssForElement = (element: Element) => {
  const matchedCss: string[] = [];
  const processedSelectors = new Set<string>();

  for (const styleSheet of document.styleSheets) {
    let rules;
    try {
      rules = styleSheet.cssRules || styleSheet.rules;
    } catch (e) {
      continue;
    }

    if (!rules) continue;

    for (const rule of rules) {
      if (rule.type === CSSRule.STYLE_RULE) {
        const selectorText = (rule as CSSStyleRule).selectorText;

        if (
          selectorText.includes("shadow") ||
          selectorText.includes("::-webkit-") ||
          selectorText.includes(":hover") ||
          selectorText.includes(":focus")
        ) {
          continue;
        }

        if (processedSelectors.has(selectorText)) continue;

        try {
          if (
            element.matches(selectorText) ||
            element.querySelectorAll(selectorText).length > 0
          ) {
            matchedCss.push(rule.cssText);
            processedSelectors.add(selectorText);
          }
        } catch (e) {
          continue;
        }
      } else if (rule.type === CSSRule.MEDIA_RULE) {
        const mediaRule = rule as CSSMediaRule;
        const mediaCss: string[] = [];
        let hasMatchingRule = false;

        for (const mediaRuleItem of Array.from(mediaRule.cssRules)) {
          if (mediaRuleItem.type === CSSRule.STYLE_RULE) {
            const styleRule = mediaRuleItem as CSSStyleRule;
            const selectorText = styleRule.selectorText;

            if (
              selectorText.includes("shadow") ||
              selectorText.includes("::-webkit-") ||
              selectorText.includes(":hover") ||
              selectorText.includes(":focus")
            ) {
              continue;
            }

            try {
              if (
                element.matches(selectorText) ||
                element.querySelectorAll(selectorText).length > 0
              ) {
                mediaCss.push(styleRule.cssText);
                hasMatchingRule = true;
              }
            } catch (e) {
              continue;
            }
          }
        }

        if (hasMatchingRule && mediaCss.length > 0) {
          matchedCss.push(
            `@media ${mediaRule.conditionText} { ${mediaCss.join(" ")} }`
          );
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
