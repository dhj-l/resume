import { computed, type Ref } from "vue";

import type { ModuleItem, ResumeData } from "@/stores/type";

export const FIXED_MODULES = ["basicInfo", "jobIntention"] as const;

export const isFixedModule = (moduleKey: string): boolean => {
  return (FIXED_MODULES as readonly string[]).includes(moduleKey);
};

const hasObjectContent = (obj: Record<string, unknown>): boolean => {
  for (const key in obj) {
    const val = obj[key];
    if (val != null && val !== "") return true;
  }
  return false;
};

export function useActiveModules(moduleOrder: Ref<ModuleItem[]>, resumeData: Ref<ResumeData>) {
  const hasContent = (item: ModuleItem): boolean => {
    if (isFixedModule(item.moduleKey)) return true;
    const data = (resumeData.value as unknown as Record<string, unknown>)[item.moduleKey];
    if (data == null) return false;
    if (Array.isArray(data)) {
      return data.some((element) => {
        if (element == null) return false;
        if (typeof element === "object") return hasObjectContent(element as Record<string, unknown>);
        return true;
      });
    }
    if (typeof data === "object") return hasObjectContent(data as Record<string, unknown>);
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
