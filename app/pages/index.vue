<template>
  <div class="flex flex-col gap-6 lg:gap-8 w-full">
    
    <!-- Top Row Content -->
    <div class="flex flex-col md:flex-row gap-6 lg:gap-10 min-w-0">
      <!-- Left Column (Total & Category Comparison) -->
      <div class="flex flex-col gap-6 lg:gap-8 w-full md:w-[55%]">
        
        <!-- Total Expenses & Chart Widget -->
        <div class="bg-card-inner rounded-[36px] pt-8 px-8 pb-0 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#eff3f1] overflow-hidden relative flex flex-col h-[400px] md:h-[320px] transition-transform hover:-translate-y-1 duration-300">
          
          <div class="relative z-10 flex flex-col h-full">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4 sm:gap-0">
              <h2 class="text-text-heading text-[22px] font-medium">Total Dépenses</h2>
              
              <!-- Time Filter Toggle -->
              <div class="flex items-center bg-[#f0f4f2] p-1.5 rounded-2xl w-fit">
                <button @click="timeFilter = 'week'" :class="['px-4 py-1.5 rounded-xl text-[13px] font-medium transition-all', timeFilter === 'week' ? 'bg-white shadow-sm text-primary' : 'text-text-body/60 hover:text-text-heading']">
                  Semaine
                </button>
                <button @click="timeFilter = 'month'" :class="['px-4 py-1.5 rounded-xl text-[13px] font-medium transition-all', timeFilter === 'month' ? 'bg-white shadow-sm text-primary' : 'text-text-body/60 hover:text-text-heading']">
                  Mois
                </button>
                <button @click="timeFilter = 'year'" :class="['px-4 py-1.5 rounded-xl text-[13px] font-medium transition-all', timeFilter === 'year' ? 'bg-white shadow-sm text-primary' : 'text-text-body/60 hover:text-text-heading']">
                  Année
                </button>
                <button @click="timeFilter = 'all'" :class="['px-4 py-1.5 rounded-xl text-[13px] font-medium transition-all', timeFilter === 'all' ? 'bg-white shadow-sm text-primary' : 'text-text-body/60 hover:text-text-heading']">
                  Tout
                </button>
              </div>
            </div>

            <!-- Dynamic Amount -->
            <div class="text-[48px] sm:text-[54px] leading-none tracking-tight font-semibold text-text-heading">
              {{ currentTotal }}
            </div>
            <div class="mt-2 text-sm text-text-body/60 font-medium">
              <span class="text-[#e25c5c]">↑ 12%</span> par rapport à la période précédente
            </div>
          </div>
          
          <!-- Dynamic Chart inside card -->
          <div class="absolute bottom-4 left-6 right-6 h-[140px] flex flex-col justify-end pointer-events-none transition-opacity duration-300">
            <!-- SVG Line Chart -->
            <svg viewBox="0 0 500 120" preserveAspectRatio="none" class="w-full h-[100px] overflow-visible">
              <defs>
                <linearGradient id="dynamicGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#294b3c" stop-opacity="0.25" />
                  <stop offset="100%" stop-color="#294b3c" stop-opacity="0.0" />
                </linearGradient>
              </defs>
              <path :d="chartAreaPath" fill="url(#dynamicGradient)" />
              <polyline :points="chartLinePoints" fill="none" stroke="#294b3c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
              <!-- Data Points -->
              <circle v-for="(pt, i) in chartData" :key="'pt-'+i" :cx="pt.x" :cy="pt.y" r="4" fill="#294b3c" stroke="#fff" stroke-width="2" />
            </svg>
            <!-- X Axis Labels -->
            <div class="flex justify-between mt-2 pt-1 border-t border-input-border/30">
              <span v-for="(pt, i) in chartData" :key="'label-'+i" 
                :class="['text-[11px] font-medium text-text-body/50', (chartData.length > 7 && i % 2 !== 0) ? 'hidden sm:block' : 'block']" 
                :style="{ width: (100 / (chartData.length > 7 ? (chartData.length/2) : chartData.length)) + '%', textAlign: 'center' }">
                {{ pt.label }}
              </span>
            </div>
          </div>
        </div>

        <!-- Category Comparison Widget -->
        <div class="bg-primary rounded-[36px] p-8 sm:p-10 shadow-[0_12px_40px_rgba(41,75,60,0.15)] flex flex-col md:h-[320px] text-white relative overflow-hidden md:overflow-hidden transition-transform hover:-translate-y-1 duration-300">
          <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

          <div class="flex justify-between items-start sm:items-center mb-6 relative z-10 shrink-0 gap-4">
            <h2 class="text-[18px] sm:text-[22px] font-medium leading-tight">Dépenses par catégorie</h2>
            <span class="text-white/60 text-[11px] sm:text-sm font-medium bg-white/10 px-3 py-1.5 rounded-full whitespace-nowrap shrink-0">{{ timeFilterLabel }}</span>
          </div>
          
          <div class="flex flex-col flex-grow gap-6 relative z-10 md:overflow-y-auto pr-2 custom-scrollbar pt-1">
            <!-- Dynamic Category generation -->
            <div v-for="(cat, index) in currentCategories" :key="index">
              <div class="flex justify-between items-end mb-2.5">
                <span class="font-medium text-[15px] sm:text-[16px] text-white/90">{{ cat.name }}</span>
                <span class="font-semibold text-[16px] sm:text-[17px] tracking-wide">{{ formatCurrency(cat.amount) }}</span>
              </div>
              <div class="h-2.5 w-full bg-white/10 rounded-full overflow-hidden shadow-inner">
                <div class="h-full bg-[#92d3a7] rounded-full transition-all duration-1000 ease-out" :style="{ width: cat.percentage + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
        
      </div>

      <!-- Right Column (Transactions) -->
      <div class="flex flex-col w-full md:w-[45%] md:h-[664px]">
        
         <!-- Recent Transactions Widget -->
         <div class="bg-card-inner rounded-[36px] pt-8 px-6 sm:px-8 pb-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#eff3f1] flex flex-col flex-grow transition-transform hover:-translate-y-1 duration-300 relative">
           
           <div class="flex justify-between items-center mb-6">
             <h2 class="text-text-heading text-[22px] font-medium">Dépenses récentes</h2>
             <NuxtLink to="/transactions/add" class="w-11 h-11 rounded-[16px] bg-primary text-white flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all shadow-md shadow-primary/20" title="Ajouter une dépense">
               <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
               </svg>
             </NuxtLink>
           </div>
           
           <!-- List that scrolls if too many -->
           <div class="flex flex-col gap-5 md:overflow-y-auto pr-2 custom-scrollbar flex-grow pb-4">
             <div v-for="(tx, index) in recentTransactions" :key="index" class="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-2xl hover:bg-input-bg transition-colors">
               <div class="flex items-center gap-4">
                 <div :class="['w-14 h-14 rounded-[18px] text-white flex items-center justify-center shadow-md', tx.meta?.bgColor]">
                   <span v-html="tx.meta?.icon"></span>
                 </div>
                 <div>
                   <h3 class="text-[16px] sm:text-[17px] font-semibold text-text-heading">{{ tx.merchant }}</h3>
                   <span class="text-[13px] sm:text-[14px] text-text-body/60 mt-0.5 block">{{ tx.category }} • {{ tx.formattedDate }}</span>
                 </div>
               </div>
               <span class="text-[16px] sm:text-[17px] font-medium text-text-heading">{{ formatCurrency(tx.amount) }}</span>
             </div>
           </div>
           
           <div class="pt-4 border-t border-input-border/50 mt-auto">
             <NuxtLink to="/transactions" class="text-[15px] font-medium text-primary hover:text-primary/70 transition-colors flex items-center justify-center gap-1 w-full text-center">
               Voir tout l'historique
               <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
               </svg>
             </NuxtLink>
           </div>

         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Time Filter State
type TimeFilter = 'week' | 'month' | 'year' | 'all';
const timeFilter = ref<TimeFilter>('month');

// Mapping filter to labels
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
  { merchant: 'Delhaize', category: 'Alimentation', date: '2026-02-27', amount: 65.20 },
  { merchant: 'Match', category: 'Shopping', date: '2026-02-26', amount: 22.10 },
  { merchant: 'Spotify', category: 'Abonnements', date: '2026-02-26', amount: 12.99 },
  { merchant: 'SNCB', category: 'Transports', date: '2026-02-21', amount: 24.50 },
  { merchant: 'Amazon', category: 'Shopping', date: '2026-02-18', amount: 2.00 },
  { merchant: 'Rent', category: 'Logement', date: '2026-02-01', amount: 1200.00 },
  { merchant: 'Restaurant Le Local', category: 'Sorties', date: '2026-02-15', amount: 45.00 },
  { merchant: 'Colruyt', category: 'Alimentation', date: '2026-01-15', amount: 125.50 },
  { merchant: 'Basic Fit', category: 'Santé & Sport', date: '2026-01-10', amount: 29.99 },
  { merchant: 'Apple Store', category: 'Shopping', date: '2025-11-24', amount: 899.00 },
  { merchant: 'IKEA', category: 'Logement', date: '2024-05-12', amount: 34500.50 },
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

const currentCategories = computed(() => {
  const stats: Record<string, number> = {};
  filteredTransactions.value.forEach(tx => {
    stats[tx.category] = (stats[tx.category] || 0) + tx.amount;
  });
  
  const total = currentTotalValue.value || 1;
  return Object.entries(stats).map(([name, amount]) => ({
    name,
    amount,
    percentage: Math.round((amount / total) * 100)
  })).sort((a, b) => b.amount - a.amount);
});

const recentTransactions = computed(() => {
  return [...transactions.value]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)
    .map(tx => ({
      ...tx,
      meta: categoryMap[tx.category] || categoryMap['Shopping'],
      formattedDate: new Date(tx.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    }));
});

// Dynamic Chart Logic
const chartData = computed(() => {
  const buckets: Record<string, number> = {};
  const labels: string[] = [];
  const now = new Date('2026-02-27');

  if (timeFilter.value === 'week') {
    // Mon to Sun
    labels.push('Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim');
    labels.forEach(l => buckets[l] = 0);
    filteredTransactions.value.forEach(tx => {
      let day = new Date(tx.date).getDay(); // 0 is Sun
      day = day === 0 ? 6 : day - 1; // Map to 0-6 (Mon-Sun)
      const label = labels[day] as string;
      buckets[label] = (buckets[label] || 0) + tx.amount;
    });
  } else if (timeFilter.value === 'month') {
    // Weeks 1 to 4
    labels.push('Sem 1', 'Sem 2', 'Sem 3', 'Sem 4+');
    labels.forEach(l => buckets[l] = 0);
    filteredTransactions.value.forEach(tx => {
      const date = new Date(tx.date).getDate();
      let week = Math.floor((date - 1) / 7);
      if (week > 3) week = 3;
      const label = labels[week] as string;
      buckets[label] = (buckets[label] || 0) + tx.amount;
    });
  } else if (timeFilter.value === 'year') {
    // 12 Months
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    labels.push(...monthNames);
    labels.forEach(l => buckets[l] = 0);
    filteredTransactions.value.forEach(tx => {
      const month = new Date(tx.date).getMonth();
      const label = labels[month] as string;
      buckets[label] = (buckets[label] || 0) + tx.amount;
    });
  } else if (timeFilter.value === 'all') {
    // Group dynamically by Years contained in dataset
    if (filteredTransactions.value.length === 0) {
      labels.push(now.getFullYear().toString());
      labels.forEach(l => buckets[l] = 0);
    } else {
      const years = filteredTransactions.value.map(tx => new Date(tx.date).getFullYear());
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years, now.getFullYear());
      for (let y = minYear; y <= maxYear; y++) {
        labels.push(y.toString());
        buckets[y.toString()] = 0;
      }
      filteredTransactions.value.forEach(tx => {
        const year = new Date(tx.date).getFullYear().toString();
        buckets[year] = (buckets[year] || 0) + tx.amount;
      });
    }
  }

  const values = labels.map(l => buckets[l] || 0);
  const max = Math.max(...values, 1);
  const width = 500;
  const height = 100;
  
  return labels.map((label, i) => {
    // Distribute X evenly
    const x = labels.length > 1 ? (i / (labels.length - 1)) * width : width / 2;
    // Y is inverted (0 is top)
    const y = height - ((values[i] || 0) / max) * height;
    
    // Add small padding so points don't clip
    const paddedY = Math.max(10, Math.min(y, height - 10));
    const paddedX = Math.max(10, Math.min(x, width - 10));

    return { label, value: values[i], x: paddedX, y: paddedY };
  });
});

const chartLinePoints = computed(() => {
  return chartData.value.map(pt => `${pt.x},${pt.y}`).join(' ');
});

const chartAreaPath = computed(() => {
  const pts = chartData.value;
  if (!pts || pts.length === 0) return '';
  const firstPt = pts[0];
  const lastPt = pts[pts.length - 1];
  if (!firstPt || !lastPt) return '';
  
  const width = 500;
  const height = 120;
  let d = `M${firstPt.x},${height} L${firstPt.x},${firstPt.y} `;
  pts.forEach((pt, i) => {
    if (i > 0) d += `L${pt.x},${pt.y} `;
  });
  d += `L${lastPt.x},${height} Z`;
  return d;
});
</script>

<style scoped>
/* Custom Scrollbar for inner zones */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(41, 75, 60, 0.2);
  border-radius: 10px;
}
.bg-primary .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}
</style>