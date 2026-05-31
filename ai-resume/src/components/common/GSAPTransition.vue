<script setup lang="ts">
import { gsap } from "gsap";

import type { TransitionPresetConfig } from "@/utils/transitions";

interface Props {
  preset: TransitionPresetConfig;
  mode?: "out-in" | "in-out" | "default";
  enabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  mode: "out-in",
  enabled: true,
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function shouldSkip(): boolean {
  return !props.enabled || props.preset.duration === 0 || prefersReducedMotion;
}

function onBeforeEnter(el: Element) {
  if (shouldSkip()) return;
  gsap.set(el, {
    ...props.preset.enter.from,
    willChange: "transform, opacity",
  });
}

function onEnter(el: Element, done: () => void) {
  if (shouldSkip()) {
    done();
    return;
  }
  gsap.to(el, {
    ...props.preset.enter.to,
    duration: props.preset.duration,
    ease: props.preset.ease,
    onComplete: () => {
      gsap.set(el, { willChange: "auto" });
      done();
    },
  });
}

function onBeforeLeave(el: Element) {
  if (shouldSkip()) return;
  gsap.set(el, { position: "absolute", width: "100%" });
}

function onLeave(el: Element, done: () => void) {
  if (shouldSkip()) {
    done();
    return;
  }
  gsap.to(el, {
    ...props.preset.leave.to,
    duration: props.preset.duration,
    ease: props.preset.ease,
    onComplete: () => {
      gsap.set(el, { willChange: "auto" });
      done();
    },
  });
}
</script>

<template>
  <Transition
    :mode="mode === 'default' ? undefined : mode"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
  >
    <slot />
  </Transition>
</template>
