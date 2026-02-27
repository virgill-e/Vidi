<template>
  <button
    :class="[
      'w-full py-3.5 px-4 rounded-xl font-medium transition-all duration-200 text-center flex items-center justify-center text-[15px] active:scale-[0.98]',
      variant === 'primary' 
        ? 'bg-primary text-white hover:bg-primary/95 shadow-[0_4px_12px_rgba(41,75,60,0.15)] hover:shadow-[0_6px_16px_rgba(41,75,60,0.2)]' 
        : 'bg-primary-light text-primary hover:bg-[#d5e4d8] shadow-sm'
    ]"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary'
}>(), {
  variant: 'primary'
});
</script>
