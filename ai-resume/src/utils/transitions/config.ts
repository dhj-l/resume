export type TransitionPreset = "fade" | "fade-slide-up" | "fade-slide-left" | "scale-in" | "none";

export interface AnimationVars {
  opacity?: number;
  x?: number;
  y?: number;
  scale?: number;
  [key: string]: unknown;
}

export interface TransitionDirectionConfig {
  from: AnimationVars;
  to: AnimationVars;
}

export interface TransitionPresetConfig {
  enter: TransitionDirectionConfig;
  leave: TransitionDirectionConfig;
  duration: number;
  ease: string;
}

export interface AnimationMeta {
  animation?: TransitionPreset;
  defaultChildAnimation?: TransitionPreset;
}
