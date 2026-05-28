import { getPreset } from "./animations";
import type { TransitionPreset, TransitionPresetConfig } from "./config";

export function resolvePresetFromMeta(
  meta: Record<string, unknown>,
  isNested = false,
): TransitionPresetConfig {
  const animation = meta.animation as TransitionPreset | undefined;
  if (animation) return getPreset(animation);

  const defaultChild = meta.defaultChildAnimation as TransitionPreset | undefined;
  if (defaultChild) return getPreset(defaultChild);

  return getPreset(isNested ? "fade-slide-up" : "fade");
}
