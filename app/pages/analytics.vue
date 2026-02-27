<template>
  <div class="flex flex-col gap-6 lg:gap-10 min-w-0 mx-auto max-w-[1200px] w-full">
    
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-hidden">
      <div>
        <h1 class="text-3xl font-bold text-text-heading tracking-tight mb-2">Analyses & Statistiques</h1>
        <p class="text-text-body/60 font-medium">Visualisez vos habitudes de consommation et optimisez votre budget.</p>
      </div>
      
      <!-- Time Filter -->
      <div class="flex items-center bg-[#e3ece8] p-1.5 rounded-[24px] w-fit shadow-sm border border-white/50">
        <button v-for="filter in filters" :key="filter.id" 
          @click="timeFilter = filter.id"
          :class="['px-6 py-2.5 rounded-[18px] text-[14px] font-semibold transition-all', timeFilter === filter.id ? 'bg-white shadow-sm text-primary' : 'text-text-body/60 hover:text-text-heading']">
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Top Stats Row -->
    <div class="grid grid-cols-1 gap-6">
      <div v-for="stat in topStats" :key="stat.label" class="bg-card-inner rounded-[36px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#eff3f1] transition-transform hover:-translate-y-1">
        <span class="text-text-body/50 text-[14px] font-semibold uppercase tracking-wider">{{ stat.label }}</span>
        <div class="text-[32px] font-bold text-text-heading mt-2">{{ stat.value }}</div>
      </div>
    </div>

    <!-- Charts Grid (Vertical Stack for more space) -->
    <div class="flex flex-col gap-8 lg:gap-10">
      
      <!-- Spending Distribution (Category Breakdown) -->
      <div class="bg-card-inner rounded-[40px] p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#eff3f1] flex flex-col">
        <h2 class="text-text-heading text-[22px] font-bold mb-8">Répartition par catégorie</h2>
        
        <div class="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-20 grow">
          <!-- Donut Chart (SVG) -->
          <div class="relative w-48 h-48 lg:w-64 lg:h-64 shrink-0 mx-auto lg:mx-0">
            <svg viewBox="0 0 100 100" class="w-full h-full transform -rotate-90">
              <circle 
                v-for="(seg, i) in donutSegments" :key="i"
                cx="50" cy="50" r="40"
                fill="transparent"
                :stroke="seg.color"
                stroke-width="12"
                :stroke-dasharray="seg.dashArray"
                :stroke-dashoffset="seg.dashOffset"
                class="transition-all duration-1000 ease-out"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-text-body/50 text-[11px] font-bold uppercase tracking-widest">Total</span>
              <span class="text-text-heading text-3xl font-bold">{{ currentTotal }}</span>
            </div>
          </div>

          <!-- Legend (2 Columns on Desktop) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5 grow w-full min-w-0 py-2">
            <div v-for="cat in categoryComparison" :key="cat.name" class="flex items-center justify-between group cursor-default gap-4 border-b border-[#eff3f1]/50 pb-2">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-3.5 h-3.5 rounded-full shrink-0" :style="{ backgroundColor: cat.color }"></div>
                <span class="text-text-heading font-semibold text-[16px] group-hover:text-primary transition-colors whitespace-nowrap">{{ cat.name }}</span>
              </div>
              <div class="flex items-center gap-4 shrink-0">
                <span class="text-text-body/40 text-[14px] font-medium">{{ cat.percentage }}%</span>
                <span class="text-text-heading font-bold text-[16px] text-right tabular-nums">{{ formatCurrency(cat.amount) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Spending by Weekday (Bar Chart) -->
      <div class="bg-primary rounded-[40px] p-8 lg:p-10 shadow-[0_12px_40px_rgba(41,75,60,0.15)] text-white flex flex-col relative">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        
        <div class="flex justify-between items-center mb-10 relative z-10">
          <h2 class="text-[22px] font-bold">Dépenses par jour de la semaine</h2>
          <span class="text-white/60 text-[13px] font-medium bg-white/10 px-4 py-1.5 rounded-full">{{ timeFilterLabel }}</span>
        </div>

        <div class="flex items-end justify-between grow gap-3 sm:gap-5 relative z-10 mb-2">
          <div v-for="day in weekdaySpending" :key="day.label" class="flex flex-col items-center grow group">
            <div class="w-full relative flex flex-col justify-end h-64 pb-1">
              <!-- Amount Label (Always visible, enhanced on hover) -->
              <div class="text-center mb-3 transition-all duration-300 transform group-hover:-translate-y-1">
                <span class="text-[10px] sm:text-[12px] font-bold text-white/50 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                  {{ formatCurrency(day.amount) }}
                </span>
              </div>
              
              <!-- Bar -->
              <div 
                class="w-full bg-[#92d3a7] rounded-t-2xl transition-all duration-700 ease-out origin-bottom relative shadow-lg group-hover:bg-white group-hover:shadow-[0_0_20px_rgba(146,211,167,0.4)]"
                :style="{ height: day.percentage + '%' }"
              >
              </div>
            </div>
            <span class="mt-4 text-[13px] font-bold text-white/40 group-hover:text-white transition-colors uppercase tracking-widest">{{ day.label }}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Bottom Row: Top Merchants -->
    <div class="bg-card-inner rounded-[40px] p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#eff3f1]">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-text-heading text-[22px] font-bold">Commerçants les plus fréquents</h2>
        <NuxtLink to="/transactions" class="text-primary font-bold text-[15px] hover:underline transition-all">Voir tout l'historique</NuxtLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(merchant, index) in topMerchants" :key="index" class="p-6 rounded-3xl bg-bg-base/50 border border-[#eff3f1] hover:border-primary/20 hover:bg-white transition-all group">
          <div class="flex items-center gap-4 mb-4">
            <div :class="['w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-sm', merchant.meta?.bgColor]">
              <span v-html="merchant.meta?.icon" class="scale-90"></span>
            </div>
            <div>
              <h3 class="text-text-heading font-bold text-[16px] group-hover:text-primary transition-colors">{{ merchant.name }}</h3>
              <span class="text-text-body/40 text-[13px] font-medium">{{ merchant.count }} transactions</span>
            </div>
          </div>
          <div class="flex justify-between items-end">
            <span class="text-text-body/40 text-[13px] font-medium">Total dépensé</span>
            <span class="text-text-heading font-bold text-[18px]">{{ formatCurrency(merchant.amount) }}</span>
          </div>
          <div class="mt-4 h-1.5 w-full bg-[#e3ece8] rounded-full overflow-hidden">
            <div class="h-full bg-primary rounded-full" :style="{ width: (merchant.amount / topMerchants[0].amount * 100) + '%' }"></div>
          </div>
        </div>
        <div v-if="topMerchants.length === 0" class="col-span-full py-10 text-center text-text-body/40 font-medium">
          Pas de données suffisantes pour cette période.
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

type TimeFilter = 'week' | 'month' | 'year' | 'all';
const timeFilter = ref<TimeFilter>('month');

const filters: { id: TimeFilter, label: string }[] = [
  { id: 'week', label: 'Semaine' },
  { id: 'month', label: 'Mois' },
  { id: 'year', label: 'Année' },
  { id: 'all', label: 'Tout' },
];

const timeFilterLabel = computed(() => {
  const labels: Record<TimeFilter, string> = {
    week: 'Cette Semaine',
    month: 'Ce Mois',
    year: 'Cette Année',
    all: 'Toujours'
  };
  return labels[timeFilter.value];
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
};

const categoryMap: Record<string, { bgColor: string, icon: string, color: string }> = {
  'Alimentation': { color: '#679178', bgColor: 'bg-[#679178]', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>' },
  'Abonnements': { color: '#294b3c', bgColor: 'bg-primary', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>' },
  'Transports': { color: '#223d31', bgColor: 'bg-[#223d31]', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>' },
  'Shopping': { color: '#557a66', bgColor: 'bg-[#557a66]', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>' },
  'Logement': { color: '#1b3127', bgColor: 'bg-[#1b3127]', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>' },
  'Sorties': { color: '#3b5e4a', bgColor: 'bg-[#3b5e4a]', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" /></svg>' },
  'Santé & Sport': { color: '#1b3127', bgColor: 'bg-[#1b3127]', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>' }
};

interface Transaction {
  merchant: string;
  category: string;
  date: string;
  amount: number;
}

const transactions = ref<Transaction[]>([
  { merchant: 'Delhaize', category: 'Alimentation', date: '2026-02-27', amount: 65.20 },
  { merchant: 'Match', category: 'Shopping', date: '2026-02-26', amount: 22.10 },
  { merchant: 'Spotify', category: 'Abonnements', date: '2026-02-26', amount: 12.99 },
  { merchant: 'SNCB', category: 'Transports', date: '2026-02-21', amount: 24.50 },
  { merchant: 'Amazon', category: 'Shopping', date: '2026-02-18', amount: 35.00 },
  { merchant: 'Rent', category: 'Logement', date: '2026-02-01', amount: 1200.00 },
  { merchant: 'Restaurant Le Local', category: 'Sorties', date: '2026-02-15', amount: 45.00 },
  { merchant: 'Delhaize', category: 'Alimentation', date: '2026-02-10', amount: 89.40 },
  { merchant: 'Colruyt', category: 'Alimentation', date: '2026-01-15', amount: 125.50 },
  { merchant: 'Basic Fit', category: 'Santé & Sport', date: '2026-01-10', amount: 29.99 },
  { merchant: 'Netflix', category: 'Abonnements', date: '2026-02-14', amount: 17.99 },
  { merchant: 'Uber', category: 'Transports', date: '2026-02-20', amount: 18.20 },
  { merchant: 'Apple Store', category: 'Shopping', date: '2025-11-24', amount: 899.00 },
  { merchant: 'IKEA', category: 'Logement', date: '2024-05-12', amount: 3450.50 },
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

const currentTotalValue = computed(() => {
  return filteredTransactions.value.reduce((acc, tx) => acc + tx.amount, 0);
});

const currentTotal = computed(() => formatCurrency(currentTotalValue.value));

const topStats = computed(() => [
  { label: 'Dépenses Totales', value: currentTotal.value },
]);

const categoryComparison = computed(() => {
  const stats: Record<string, number> = {};
  filteredTransactions.value.forEach(tx => {
    stats[tx.category] = (stats[tx.category] || 0) + tx.amount;
  });
  
  const total = currentTotalValue.value || 1;
  const entries = Object.entries(stats)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: Math.round((amount / total) * 100),
      color: categoryMap[name]?.color || '#94a3b8'
    }))
    .sort((a, b) => b.amount - a.amount);

  if (entries.length <= 6) return entries;

  const topEntries = entries.slice(0, 5);
  const remainingEntries = entries.slice(5);
  const otherAmount = remainingEntries.reduce((acc, curr) => acc + curr.amount, 0);
  
  topEntries.push({
    name: 'Autres',
    amount: otherAmount,
    percentage: Math.round((otherAmount / total) * 100),
    color: '#94a3b8' // Slate-400 for 'Others'
  });

  return topEntries;
});

const donutSegments = computed(() => {
  let currentOffset = 0;
  return categoryComparison.value.map(cat => {
    const dashArray = `${(cat.percentage * 251.2) / 100} 251.2`;
    const dashOffset = -currentOffset;
    currentOffset += (cat.percentage * 251.2) / 100;
    return { ...cat, dashArray, dashOffset: dashOffset.toString() };
  });
});

const weekdaySpending = computed(() => {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const amounts = [0, 0, 0, 0, 0, 0, 0];
  
  filteredTransactions.value.forEach(tx => {
    let day = new Date(tx.date).getDay();
    day = day === 0 ? 6 : day - 1; // Map to 0-6 (Mon-Sun)
    const current = amounts[day] || 0;
    amounts[day] = current + tx.amount;
  });

  const max = Math.max(...amounts.filter((v): v is number => v !== undefined), 1);
  return days.map((label, i) => ({
    label,
    amount: amounts[i] || 0,
    percentage: ((amounts[i] || 0) / max) * 100
  }));
});

const topMerchants = computed(() => {
  const counts: Record<string, { amount: number, count: number, category: string }> = {};
  filteredTransactions.value.forEach(tx => {
    if (!counts[tx.merchant]) {
      counts[tx.merchant] = { amount: 0, count: 0, category: tx.category };
    }
    counts[tx.merchant].amount += tx.amount;
    counts[tx.merchant].count += 1;
  });

  return Object.entries(counts)
    .map(([name, data]) => ({
      name,
      ...data,
      meta: categoryMap[data.category] || categoryMap['Shopping']
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
</style>
