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

<div class="flex gap-1 flex-wrap items-center">
  {#each $smaOptions as sma}
    <button
      class="relative px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-200 transform hover:scale-105
        {sma.enabled 
          ? 'text-white shadow-lg' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
      style="{sma.enabled ? `background-color: ${sma.color}` : ''}"
      on:click={() => toggleSMA(sma.period)}
    >
      <span class="relative z-10">{sma.period}</span>
      {#if sma.enabled}
        <div class="absolute inset-0 rounded-full opacity-30 animate-pulse" style="background-color: {sma.color}"></div>
      {/if}
    </button>
  {/each}
</div>