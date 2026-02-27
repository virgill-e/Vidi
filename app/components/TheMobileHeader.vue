<template>
  <div class="md:hidden flex items-center justify-between mb-2">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
        V
      </div>
      <span class="text-text-heading text-xl font-bold tracking-tight">Vidi Ledger</span>
    </div>
    <button @click="openMenu" class="w-10 h-10 flex items-center justify-center rounded-xl bg-card-inner border border-input-border text-primary active:scale-95 transition-transform z-10">
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
const { openMenu } = useNavigation();
</script>
