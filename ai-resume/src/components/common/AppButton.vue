<template>
  <button
    :class="[
      'inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses[variant],
      sizeClasses[size],
      block ? 'w-full' : '',
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <Loader2 v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";

interface Props {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  block: false,
  disabled: false,
  loading: false,
});

defineEmits(["click"]);

const variantClasses = {
  primary:
    "bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:-translate-y-0.5 active:translate-y-0",
  outline: "bg-transparent border border-primary-500 text-primary-500 hover:bg-primary-50",
  ghost: "bg-transparent text-slate-600 hover:text-primary-600 hover:bg-slate-100",
};

const sizeClasses = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-2.5 text-sm font-medium rounded-xl",
  lg: "px-8 py-4 text-base font-bold rounded-xl",
};
</script>
