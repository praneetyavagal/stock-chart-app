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

<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    <div>
      <p class="text-xs text-gray-500">Current Price</p>
      <p class="text-xl font-semibold text-gray-900">
        ${currentPrice.toFixed(2)}
      </p>
      <p class="text-sm {priceChange >= 0 ? 'text-green-600' : 'text-red-600'}">
        {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%)
      </p>
    </div>
    
    {#if priceData}
      <div>
        <p class="text-xs text-gray-500">Date</p>
        <p class="text-sm font-medium text-gray-900">
          {format(new Date(priceData.date), 'MMM dd, yyyy')}
        </p>
      </div>
      
      <div>
        <p class="text-xs text-gray-500">Open</p>
        <p class="text-sm font-medium text-gray-900">
          ${priceData.open.toFixed(2)}
        </p>
      </div>
      
      <div>
        <p class="text-xs text-gray-500">High</p>
        <p class="text-sm font-medium text-gray-900">
          ${priceData.high.toFixed(2)}
        </p>
      </div>
      
      <div>
        <p class="text-xs text-gray-500">Low</p>
        <p class="text-sm font-medium text-gray-900">
          ${priceData.low.toFixed(2)}
        </p>
      </div>
      
      <div>
        <p class="text-xs text-gray-500">Volume</p>
        <p class="text-sm font-medium text-gray-900">
          {formatVolume(priceData.volume)}
        </p>
      </div>
    {/if}
  </div>
</div>