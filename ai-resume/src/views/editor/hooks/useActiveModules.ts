import { computed, type Ref } from "vue";

import type { ModuleItem, ResumeData } from "@/stores/type";

export const FIXED_MODULES = ["basicInfo", "jobIntention"] as const;

export const isFixedModule = (moduleKey: string): boolean => {
  return (FIXED_MODULES as readonly string[]).includes(moduleKey);
};

export function useActiveModules(moduleOrder: Ref<ModuleItem[]>, resumeData: Ref<ResumeData>) {
  const hasContent = (item: ModuleItem): boolean => {
    if (isFixedModule(item.moduleKey)) return true;
    const data = (resumeData.value as unknown as Record<string, unknown>)[item.moduleKey];
    if (data == null) return false;
    if (Array.isArray(data)) return data.length > 0;
    if (typeof data === "object")
      return "content" in data && (data as Record<string, unknown>).content !== "";
    return true;
  };

  const activeModules = computed(() => {
    return moduleOrder.value.filter((item) => item.isShow && hasContent(item));
  });

  const moduleByKey = computed(() => {
    const map = new Map<string, ModuleItem>();
    for (const item of activeModules.value) {
      map.set(item.moduleKey, item);
    }
    return map;
  });

  return { activeModules, moduleByKey };
}
