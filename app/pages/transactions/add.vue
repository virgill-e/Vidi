<template>
  <div class="flex flex-col gap-6 lg:gap-10 min-w-0 mx-auto max-w-[800px] w-full pb-20">
    
    <!-- Header Section -->
    <div class="flex flex-col gap-2">
      <NuxtLink to="/" class="flex items-center gap-2 text-text-body/60 hover:text-primary transition-colors font-semibold text-sm mb-2 w-fit">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Retour au tableau de bord
      </NuxtLink>
      <h1 class="text-3xl font-bold text-text-heading tracking-tight">Ajouter une dépense</h1>
      <p class="text-text-body/60 font-medium">Saisissez les détails de votre transaction manuellement.</p>
    </div>

    <!-- Main Form Card -->
    <div class="bg-card-inner rounded-[40px] p-8 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#eff3f1]">
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-8">
        
        <!-- Amount Input Group -->
        <div class="flex flex-col items-center justify-center py-10 bg-bg-base/50 rounded-[32px] border border-[#eff3f1] mb-4">
          <span class="text-text-body/40 text-sm font-bold uppercase tracking-widest mb-4">Montant de la dépense</span>
          <div class="relative flex items-center">
            <input 
              type="number" 
              step="0.01" 
              v-model="form.amount"
              placeholder="0.00"
              class="bg-transparent text-[64px] font-black text-text-heading text-center focus:outline-none w-full max-w-[300px] placeholder:text-text-body/10"
              required
            />
            <span class="text-[32px] font-bold text-primary ml-2">€</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Merchant / Label -->
          <div class="flex flex-col gap-3">
            <label class="text-text-heading font-bold text-[15px] ml-2">Commerçant ou libellé</label>
            <div class="relative group">
              <input 
                type="text" 
                v-model="form.merchant"
                placeholder="Ex: Delhaize, Amazon..."
                class="w-full bg-white border border-[#e3ece8] rounded-[22px] px-6 py-4 text-text-heading font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                required
              />
              <div class="absolute right-5 top-1/2 -translate-y-1/2 text-text-body/20 group-focus-within:text-primary transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Date -->
          <div class="flex flex-col gap-3">
            <label class="text-text-heading font-bold text-[15px] ml-2">Date de transaction</label>
            <div class="relative group">
              <input 
                type="date" 
                v-model="form.date"
                class="w-full bg-white border border-[#e3ece8] rounded-[22px] px-6 py-4 text-text-heading font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none appearance-none"
                required
              />
              <div class="absolute right-5 top-1/2 -translate-y-1/2 text-text-body/20 group-focus-within:text-primary transition-colors pointer-events-none">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Category Selector -->
        <div class="flex flex-col gap-4">
          <label class="text-text-heading font-bold text-[15px] ml-2">Catégorie</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <button 
              type="button"
              v-for="(cat, name) in categoryMap" 
              :key="name"
              @click="form.category = name"
              :class="[
                'flex flex-col items-center gap-3 p-4 rounded-[24px] border transition-all relative overflow-hidden group',
                form.category === name 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-[#e3ece8] bg-white hover:border-primary/30 hover:bg-bg-base'
              ]"
            >
              <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110', cat.bgColor]">
                <span v-html="cat.icon" class="scale-75"></span>
              </div>
              <span :class="['text-[11px] font-bold text-center leading-tight', form.category === name ? 'text-primary' : 'text-text-body/60']">{{ name }}</span>
              <div v-if="form.category === name" class="absolute top-2 right-2">
                <div class="w-2 h-2 bg-primary rounded-full"></div>
              </div>
            </button>
          </div>
        </div>

        <!-- Note / Attachment (Optional) -->
        <div class="flex flex-col gap-3">
          <label class="text-text-heading font-bold text-[15px] ml-2">Note (optionnel)</label>
          <textarea 
            v-model="form.note"
            rows="3"
            placeholder="Détails supplémentaires..."
            class="w-full bg-white border border-[#e3ece8] rounded-[22px] px-6 py-4 text-text-heading font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none resize-none"
          ></textarea>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit"
          :disabled="isSubmitting"
          class="mt-4 w-full bg-primary text-white py-5 rounded-[24px] text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0"
        >
          <svg v-if="isSubmitting" class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-if="!isSubmitting">Enregistrer la dépense</span>
          <span v-else>Enregistrement...</span>
        </button>
      </form>
    </div>

    <!-- Feedback Message -->
    <Transition name="fade">
      <div v-if="showSuccess" class="fixed bottom-10 left-1/2 -translate-x-1/2 bg-text-heading text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 z-50">
        <div class="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span class="font-bold">Dépense enregistrée avec succès !</span>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const isSubmitting = ref(false);
const showSuccess = ref(false);

const form = reactive({
  amount: undefined,
  merchant: '',
  date: new Date().toISOString().split('T')[0],
  category: 'Shopping',
  note: ''
});

const categoryMap: Record<string, { bgColor: string, icon: string }> = {
  'Alimentation': { bgColor: 'bg-[#679178]', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>' },
  'Abonnements': { bgColor: 'bg-primary', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>' },
  'Transports': { bgColor: 'bg-[#223d31]', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>' },
  'Shopping': { bgColor: 'bg-[#557a66]', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>' },
  'Logement': { bgColor: 'bg-[#1b3127]', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>' },
  'Sorties': { bgColor: 'bg-[#3b5e4a]', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" /></svg>' },
  'Santé & Sport': { bgColor: 'bg-[#1b3127]', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>' }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  
  // Simulate API Call
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  console.log('Expense Saved (Mock):', { ...form });
  
  isSubmitting.value = false;
  showSuccess.value = true;
  
  // Wait for 1.5s to let the user see the success message, then redirect
  setTimeout(async () => {
    showSuccess.value = false;
    await navigateTo('/transactions');
  }, 1500);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: auto;
  height: auto;
  color: transparent;
  background: transparent;
}
</style>
