import type { Directive } from "vue";

import DOMPurify from "dompurify";

export const safeHtml: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    el.innerHTML = DOMPurify.sanitize(binding.value ?? "");
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      el.innerHTML = DOMPurify.sanitize(binding.value ?? "");
    }
  },
};
