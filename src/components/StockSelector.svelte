<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let selectedSymbol: string = 'IBM';

  const dispatch = createEventDispatcher();

  const availableStocks = [
    { symbol: 'IBM', name: 'International Business Machines' },
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' }
  ];

  let searchQuery = '';
  let showDropdown = false;

  $: filteredStocks = availableStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  $: selectedStock = availableStocks.find(s => s.symbol === selectedSymbol);

  function selectStock(stock: typeof availableStocks[0]) {
    selectedSymbol = stock.symbol;
    searchQuery = '';
    showDropdown = false;
    dispatch('change', stock.symbol);
  }

  function handleInputFocus() {
    showDropdown = true;
  }

  function handleInputBlur() {
    // Delay to allow click on dropdown items
    setTimeout(() => {
      showDropdown = false;
    }, 200);
  }
</script>

<div class="stock-selector">
  <div class="search-container">
    <div class="search-icon">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
      </svg>
    </div>
    <input
      type="text"
      class="search-input"
      placeholder=""
      bind:value={searchQuery}
      on:focus={handleInputFocus}
      on:blur={handleInputBlur}
    />
    {#if selectedStock && !searchQuery}
      <div class="selected-stock">
        <span class="symbol">{selectedStock.symbol}</span>
        <span class="name">{selectedStock.name}</span>
      </div>
    {/if}
  </div>

  {#if showDropdown && (searchQuery || filteredStocks.length > 0)}
    <div class="dropdown">
      {#each filteredStocks as stock}
        <button
          class="dropdown-item"
          class:selected={stock.symbol === selectedSymbol}
          on:click={() => selectStock(stock)}
        >
          <span class="symbol">{stock.symbol}</span>
          <span class="name">{stock.name}</span>
        </button>
      {/each}
      {#if filteredStocks.length === 0}
        <div class="no-results">No stocks found</div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .stock-selector {
    position: relative;
    width: 100%;
    max-width: 400px;
  }

  .search-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-icon {
    position: absolute;
    left: 12px;
    color: #999;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 10px 12px 10px 36px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    background: white;
  }

  .search-input:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
  }

  .selected-stock {
    position: absolute;
    left: 36px;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    pointer-events: none;
    max-width: calc(100% - 48px);
  }

  .selected-stock .symbol {
    font-weight: 600;
    color: #333;
    flex-shrink: 0;
  }

  .selected-stock .name {
    font-size: 13px;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 4px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-height: 300px;
    overflow-y: auto;
    z-index: 100;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 12px 16px;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .dropdown-item:hover {
    background: #f5f5f5;
  }

  .dropdown-item.selected {
    background: #e3f2fd;
  }

  .dropdown-item .symbol {
    font-weight: 600;
    color: #333;
    min-width: 60px;
  }

  .dropdown-item .name {
    font-size: 13px;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .no-results {
    padding: 16px;
    text-align: center;
    color: #666;
    font-size: 14px;
  }
</style>