import type { TransitionPreset, TransitionPresetConfig } from "./config";
import { getPreset } from "./animations";

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
