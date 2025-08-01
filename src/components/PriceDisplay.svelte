<script lang="ts">
  import { format } from 'date-fns';
  
  export let priceData: {
    date: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  } | null = null;
  
  export let currentPrice: number = 0;
  export let priceChange: number = 0;
  export let percentChange: number = 0;
  
  function formatVolume(volume: number): string {
    if (volume >= 1000000) {
      return (volume / 1000000).toFixed(2) + 'M';
    } else if (volume >= 1000) {
      return (volume / 1000).toFixed(2) + 'K';
    }
    return volume.toString();
  }
</script>

<div class="bg-gradient-to-r from-white to-gray-50 p-2 sm:p-2.5 rounded-xl shadow-md border border-gray-100">
  <div class="flex items-center gap-3 sm:gap-4 overflow-x-auto">
    <div class="flex-shrink-0">
      <div class="flex items-baseline gap-2">
        <p class="text-lg sm:text-xl font-bold text-gray-900">
          ${currentPrice.toFixed(2)}
        </p>
        <div class="flex items-center gap-1 px-2 py-0.5 rounded-full {priceChange >= 0 ? 'bg-green-100' : 'bg-red-100'}">
          <svg class="w-3 h-3 {priceChange >= 0 ? 'text-green-600' : 'text-red-600'}" fill="currentColor" viewBox="0 0 20 20">
            {#if priceChange >= 0}
              <path d="M10 3l7 7-7 7v-14z" transform="rotate(-90 10 10)"/>
            {:else}
              <path d="M10 17l7-7-7-7v14z" transform="rotate(-90 10 10)"/>
            {/if}
          </svg>
          <span class="text-xs font-semibold {priceChange >= 0 ? 'text-green-700' : 'text-red-700'}">
            {Math.abs(percentChange).toFixed(2)}%
          </span>
        </div>
      </div>
      <p class="text-xs text-gray-500 mt-0.5">Current Price</p>
    </div>
    
    {#if priceData}
      <div class="h-8 w-px bg-gray-200 flex-shrink-0"></div>
      
      <div class="flex gap-3 sm:gap-4 text-xs">
        <div class="flex-shrink-0">
          <span class="text-gray-500">O:</span>
          <span class="font-medium text-gray-700">${priceData.open.toFixed(2)}</span>
        </div>
        <div class="flex-shrink-0">
          <span class="text-gray-500">H:</span>
          <span class="font-medium text-gray-700">${priceData.high.toFixed(2)}</span>
        </div>
        <div class="flex-shrink-0">
          <span class="text-gray-500">L:</span>
          <span class="font-medium text-gray-700">${priceData.low.toFixed(2)}</span>
        </div>
        <div class="flex-shrink-0">
          <span class="text-gray-500">Vol:</span>
          <span class="font-medium text-gray-700">{formatVolume(priceData.volume)}</span>
        </div>
        <div class="flex-shrink-0 hidden sm:block">
          <span class="text-gray-500">Date:</span>
          <span class="font-medium text-gray-700">{format(new Date(priceData.date), 'MMM dd, yyyy')}</span>
        </div>
      </div>
    {/if}
  </div>
</div>