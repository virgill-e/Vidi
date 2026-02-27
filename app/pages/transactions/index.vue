<template>
  <div class="flex flex-col gap-6 lg:gap-10 min-w-0 mx-auto max-w-[1200px] w-full">
    
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-hidden">
      <div>
        <h1 class="text-3xl font-bold text-text-heading tracking-tight mb-2">Historique des Dépenses</h1>
        <p class="text-text-body/60 font-medium">Gérez et analysez toutes vos transactions passées.</p>
      </div>
      
      <NuxtLink to="/transactions/add" class="flex items-center justify-center gap-2 bg-primary text-white px-6 py-4 rounded-[20px] font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter une dépense
      </NuxtLink>
    </div>

    <!-- Filters & Search Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Search Bar -->
      <div class="lg:col-span-1">
        <div class="relative group">
          <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-body/40 group-focus-within:text-primary transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Rechercher un commerçant..." 
            class="w-full bg-card-inner border border-[#eff3f1] rounded-[24px] py-4 pl-12 pr-6 text-text-heading font-medium placeholder:text-text-body/30 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all"
          >
        </div>
      </div>

      <!-- Time Filter -->
      <div class="grow flex items-center bg-[#e3ece8] p-1.5 rounded-[24px] w-full">
        <button v-for="filter in filters" :key="filter.id" 
          @click="timeFilter = filter.id"
          :class="['grow py-3 rounded-[18px] text-[14px] font-semibold transition-all', timeFilter === filter.id ? 'bg-white shadow-sm text-primary' : 'text-text-body/60 hover:text-text-heading']">
          {{ filter.label }}
        </button>
      </div>

      <!-- Category Filter -->
      <div class="relative group">
        <select 
          v-model="selectedCategory"
          class="w-full appearance-none bg-card-inner border border-[#eff3f1] rounded-[24px] py-4 px-6 text-text-heading font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all cursor-pointer"
        >
          <option value="all">Toutes les catégories</option>
          <option v-for="(meta, name) in categoryMap" :key="name" :value="name">{{ name }}</option>
        </select>
        <div class="absolute inset-y-0 right-6 flex items-center pointer-events-none text-text-body/40">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Transactions List -->
    <div class="bg-card-inner rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#eff3f1] overflow-hidden flex flex-col grow min-h-[500px]">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-[#eff3f1]">
              <th class="px-8 py-6 text-text-body/40 font-semibold text-[13px] uppercase tracking-wider">Date</th>
              <th class="px-8 py-6 text-text-body/40 font-semibold text-[13px] uppercase tracking-wider">Commerçant</th>
              <th class="px-8 py-6 text-text-body/40 font-semibold text-[13px] uppercase tracking-wider">Catégorie</th>
              <th class="px-8 py-6 text-text-body/40 font-semibold text-[13px] uppercase tracking-wider text-right">Montant</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#eff3f1]/50">
            <tr v-for="(tx, index) in finalTransactions" :key="index" class="hover:bg-input-bg/50 transition-colors group cursor-pointer">
              <td class="px-8 py-5">
                <span class="text-text-body font-semibold text-[15px]">{{ tx.formattedDate }}</span>
              </td>
              <td class="px-8 py-5">
                <div class="flex items-center gap-4">
                  <div :class="['w-10 h-10 rounded-[14px] text-white flex items-center justify-center shadow-sm shrink-0', tx.meta?.bgColor]">
                    <span v-html="tx.meta?.icon" class="scale-75"></span>
                  </div>
                  <span class="text-text-heading font-bold text-[16px]">{{ tx.merchant }}</span>
                </div>
              </td>
              <td class="px-8 py-5">
                <span class="px-4 py-1.5 rounded-full bg-[#f0f4f2] text-primary text-[13px] font-bold border border-primary/5">
                  {{ tx.category }}
                </span>
              </td>
              <td class="px-8 py-5 text-right">
                <span :class="['text-[17px] font-bold', tx.amount > 0 ? 'text-primary' : 'text-text-heading']">
                  {{ tx.amount > 0 ? '+' : '' }}{{ formatCurrency(tx.amount) }}
                </span>
              </td>
            </tr>
            <tr v-if="finalTransactions.length === 0">
              <td colspan="4" class="px-8 py-20 text-center">
                <div class="flex flex-col items-center gap-4 text-text-body/40">
                  <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="text-xl font-medium">Aucune dépense trouvée</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination (Mock) -->
      <div class="mt-auto border-t border-[#eff3f1] p-8 flex items-center justify-between">
        <span class="text-[14px] text-text-body/50 font-medium">Affichage de 1 à {{ finalTransactions.length }} sur {{ filteredTransactions.length }} transactions</span>
        <div class="flex gap-3">
          <button class="w-10 h-10 rounded-xl border border-[#eff3f1] flex items-center justify-center text-text-body/40 hover:bg-input-bg transition-colors disabled:opacity-30" disabled>
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button class="w-10 h-10 rounded-xl bg-white border border-primary/20 flex items-center justify-center text-primary font-bold shadow-sm">1</button>
          <button class="w-10 h-10 rounded-xl border border-[#eff3f1] flex items-center justify-center text-text-body/40 hover:bg-input-bg transition-colors disabled:opacity-30" disabled>
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const searchQuery = ref('');
const selectedCategory = ref('all');

type TimeFilter = 'week' | 'month' | 'year' | 'all';
const timeFilter = ref<TimeFilter>('all');

const filters: { id: TimeFilter, label: string }[] = [
  { id: 'week', label: 'Semaine' },
  { id: 'month', label: 'Mois' },
  { id: 'year', label: 'Année' },
  { id: 'all', label: 'Tout' },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
};

const categoryMap: Record<string, { bgColor: string, icon: string }> = {
  'Alimentation': { bgColor: 'bg-[#679178]', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>' },
  'Abonnements': { bgColor: 'bg-primary', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>' },
  'Transports': { bgColor: 'bg-[#223d31]', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>' },
  'Shopping': { bgColor: 'bg-[#557a66]', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>' },
  'Logement': { bgColor: 'bg-[#1b3127]', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>' },
  'Sorties': { bgColor: 'bg-[#3b5e4a]', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" /></svg>' },
  'Santé & Sport': { bgColor: 'bg-[#1b3127]', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>' }
};

interface Transaction {
  merchant: string;
  category: string;
  date: string;
  amount: number;
}

const transactions = ref<Transaction[]>([
  { merchant: 'Delhaize', category: 'Alimentation', date: '2026-02-27', amount: -65.20 },
  { merchant: 'Match', category: 'Shopping', date: '2026-02-26', amount: -22.10 },
  { merchant: 'Spotify', category: 'Abonnements', date: '2026-02-26', amount: -12.99 },
  { merchant: 'SNCB', category: 'Transports', date: '2026-02-21', amount: -24.50 },
  { merchant: 'Amazon', category: 'Shopping', date: '2026-02-18', amount: -2.00 },
  { merchant: 'Rent', category: 'Logement', date: '2026-02-01', amount: -1200.00 },
  { merchant: 'Restaurant Le Local', category: 'Sorties', date: '2026-02-15', amount: -45.00 },
  { merchant: 'Colruyt', category: 'Alimentation', date: '2026-01-15', amount: -125.50 },
  { merchant: 'Basic Fit', category: 'Santé & Sport', date: '2026-01-10', amount: -29.99 },
  { merchant: 'Apple Store', category: 'Shopping', date: '2025-11-24', amount: -899.00 },
  { merchant: 'IKEA', category: 'Logement', date: '2024-05-12', amount: -34500.50 },
  { merchant: 'Remboursement Assurance', category: 'Santé & Sport', date: '2026-02-28', amount: 45.00 },
]);

const getWeekNumber = (date: Date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

const filteredTransactions = computed(() => {
  const now = new Date('2026-02-27');
  return transactions.value.filter(tx => {
    // Category filter
    if (selectedCategory.value !== 'all' && tx.category !== selectedCategory.value) return false;

    // Time filter
    const txDate = new Date(tx.date);
    if (timeFilter.value === 'week') {
      return getWeekNumber(txDate) === getWeekNumber(now) && txDate.getFullYear() === now.getFullYear();
    } else if (timeFilter.value === 'month') {
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    } else if (timeFilter.value === 'year') {
      return txDate.getFullYear() === now.getFullYear();
    }
    return true;
  });
});

const finalTransactions = computed(() => {
  return filteredTransactions.value
    .filter(tx => tx.merchant.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(tx => ({
      ...tx,
      meta: categoryMap[tx.category] || categoryMap['Shopping'],
      formattedDate: new Date(tx.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    }));
});
</script>

<style scoped>
/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(41, 75, 60, 0.1);
  border-radius: 20px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(41, 75, 60, 0.2);
}

table tr:last-child {
  border-bottom: none;
}
</style>
