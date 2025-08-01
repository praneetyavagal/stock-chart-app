<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { searchSymbols } from '../services/stockApi';
  
  const dispatch = createEventDispatcher();
  
  export let selectedSymbol = 'AAPL';
  
  let searchQuery = '';
  let searchResults: { symbol: string; name: string }[] = [];
  let showDropdown = false;
  let searchTimeout: NodeJS.Timeout;
  
  async function handleSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
      if (searchQuery.length > 0) {
        searchResults = await searchSymbols(searchQuery);
        showDropdown = true;
      } else {
        searchResults = [];
        showDropdown = false;
      }
    }, 300);
  }
  
  function selectStock(symbol: string, name: string) {
    selectedSymbol = symbol;
    searchQuery = `${symbol} - ${name}`;
    showDropdown = false;
    dispatch('select', { symbol, name });
  }
  
  function handleBlur() {
    setTimeout(() => {
      showDropdown = false;
    }, 200);
  }
</script>

<div class="relative">
  <div class="relative">
    <input
      type="text"
      placeholder="Search stocks..."
      bind:value={searchQuery}
      on:input={handleSearch}
      on:focus={() => searchQuery && handleSearch()}
      on:blur={handleBlur}
      class="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
    />
    <svg class="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>
  </div>
  
  {#if showDropdown && searchResults.length > 0}
    <div class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
      {#each searchResults as result}
        <button
          class="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex justify-between items-center"
          on:click={() => selectStock(result.symbol, result.name)}
        >
          <span class="font-medium">{result.symbol}</span>
          <span class="text-sm text-gray-600 truncate ml-2">{result.name}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>