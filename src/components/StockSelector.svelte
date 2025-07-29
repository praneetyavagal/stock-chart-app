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
  <input
    type="text"
    placeholder="Search stocks..."
    bind:value={searchQuery}
    on:input={handleSearch}
    on:focus={() => searchQuery && handleSearch()}
    on:blur={handleBlur}
    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  
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