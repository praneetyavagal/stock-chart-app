<script lang="ts">
  import { smaOptions } from '../stores/stockData';
  
  function toggleSMA(period: number) {
    smaOptions.update(options => 
      options.map(opt => 
        opt.period === period 
          ? { ...opt, enabled: !opt.enabled }
          : opt
      )
    );
  }
</script>

<div class="flex gap-2 flex-wrap">
  <span class="text-sm font-medium text-gray-700 self-center">Moving Averages:</span>
  {#each $smaOptions as sma}
    <button
      class="px-3 py-1 text-sm rounded-md border transition-all duration-200
        {sma.enabled 
          ? 'bg-white border-gray-300 shadow-sm' 
          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}"
      style="color: {sma.color}; border-color: {sma.enabled ? sma.color : ''}"
      on:click={() => toggleSMA(sma.period)}
    >
      SMA({sma.period})
    </button>
  {/each}
</div>