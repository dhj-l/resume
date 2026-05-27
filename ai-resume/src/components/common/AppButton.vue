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
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
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
