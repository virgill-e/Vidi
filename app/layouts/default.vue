<template>
  <div class="min-h-screen bg-bg-base flex p-4 sm:p-6 lg:p-10 gap-6 lg:gap-10 font-sans selection:bg-primary-light selection:text-primary relative overflow-x-hidden">
    
    <!-- Mobile Menu Overlay -->
    <div v-if="isMobileMenuOpen" @click="closeMenu" class="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm transition-opacity"></div>

    <!-- Sidebar Navigation -->
    <TheSidebar />

    <!-- Main Content Container -->
    <main class="grow flex flex-col md:flex-row gap-6 lg:gap-10 min-w-0 mx-auto max-w-[1200px] w-full md:ml-[134px] lg:ml-[150px]">
      <div class="grow flex flex-col min-w-0">
        <TheMobileHeader />
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { isMobileMenuOpen, closeMenu } = useNavigation();
</script>
