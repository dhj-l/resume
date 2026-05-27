import type { TransitionPreset, TransitionPresetConfig } from "./config";

export const TRANSITION_PRESETS: Record<TransitionPreset, TransitionPresetConfig> = {
  fade: {
    enter: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    leave: {
      from: { opacity: 1 },
      to: { opacity: 0 },
    },
    duration: 0.35,
    ease: "power2.inOut",
  },

  "fade-slide-up": {
    enter: {
      from: { opacity: 0, y: 24 },
      to: { opacity: 1, y: 0 },
    },
    leave: {
      from: { opacity: 1, y: 0 },
      to: { opacity: 0, y: -16 },
    },
    duration: 0.4,
    ease: "power2.out",
  },

  "fade-slide-left": {
    enter: {
      from: { opacity: 0, x: 30 },
      to: { opacity: 1, x: 0 },
    },
    leave: {
      from: { opacity: 1, x: 0 },
      to: { opacity: 0, x: -30 },
    },
    duration: 0.3,
    ease: "power2.inOut",
  },

  "scale-in": {
    enter: {
      from: { opacity: 0, scale: 0.96 },
      to: { opacity: 1, scale: 1 },
    },
    leave: {
      from: { opacity: 1, scale: 1 },
      to: { opacity: 0, scale: 1.02 },
    },
    duration: 0.4,
    ease: "power3.out",
  },

  none: {
    enter: { from: {}, to: {} },
    leave: { from: {}, to: {} },
    duration: 0,
    ease: "none",
  },
};

export function getPreset(name?: TransitionPreset): TransitionPresetConfig {
  return TRANSITION_PRESETS[name ?? "fade"];
}
