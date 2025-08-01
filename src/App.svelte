<script lang="ts">
  import { onMount } from 'svelte';
  import StockChart from './components/StockChart.svelte';
  import SMAControls from './components/SMAControls.svelte';
  import PeriodSelector from './components/PeriodSelector.svelte';
  import PriceDisplay from './components/PriceDisplay.svelte';
  import StockSelector from './components/StockSelector.svelte';
  import { fetchStockData } from './services/stockApi';
  import { filterDataByDateRange, getDateRange } from './services/calculations';
  import { currentStock, selectedPeriod, loading, error } from './stores/stockData';
  import type { StockData } from './types/stock';
  
  let selectedSymbol = 'AAPL';
  let chartData: StockData[] = [];
  let hoveredPrice: any = null;
  let currentPrice = 0;
  let priceChange = 0;
  let percentChange = 0;
  
  async function loadStockData(symbol: string) {
    loading.set(true);
    error.set(null);
    
    try {
      const stockQuote = await fetchStockData(symbol, 1825);
      currentStock.set(stockQuote);
      
      updateChartData();
    } catch (err) {
      error.set('Failed to load stock data');
      console.error(err);
    } finally {
      loading.set(false);
    }
  }
  
  function updateChartData() {
    if (!$currentStock) return;
    
    const period = $selectedPeriod;
    let filteredData: StockData[];
    
    if (period.startDate && period.endDate) {
      filteredData = filterDataByDateRange($currentStock.data, period.startDate, period.endDate);
    } else if (period.days) {
      const { start, end } = getDateRange(period.days);
      filteredData = filterDataByDateRange($currentStock.data, start, end);
    } else {
      filteredData = $currentStock.data;
    }
    
    chartData = filteredData;
    
    if (filteredData.length > 0) {
      currentPrice = filteredData[filteredData.length - 1].close;
      const previousClose = filteredData.length > 1 ? filteredData[filteredData.length - 2].close : currentPrice;
      priceChange = currentPrice - previousClose;
      percentChange = (priceChange / previousClose) * 100;
    }
  }
  
  function handleStockSelect(event: CustomEvent) {
    selectedSymbol = event.detail.symbol;
    loadStockData(selectedSymbol);
  }
  
  function handlePeriodChange() {
    updateChartData();
  }
  
  function handlePriceUpdate(price: any) {
    hoveredPrice = price;
  }
  
  onMount(() => {
    loadStockData(selectedSymbol);
  });
  
  $: $selectedPeriod && updateChartData();
</script>

<main class="w-full h-screen flex flex-col overflow-hidden">
  <header class="bg-white/95 backdrop-blur-sm shadow-lg flex-shrink-0">
    <div class="max-w-7xl mx-auto px-3 py-2 sm:px-4 sm:py-2.5">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 class="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">TradingView</h1>
          </div>
          <div class="w-full sm:w-56 lg:w-64">
            <StockSelector {selectedSymbol} on:select={handleStockSelect} />
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <PeriodSelector on:periodChange={handlePeriodChange} />
          <div class="h-6 w-px bg-gray-200 hidden sm:block"></div>
          <SMAControls />
        </div>
      </div>
    </div>
  </header>
  
  <div class="flex-1 max-w-7xl mx-auto w-full px-2 py-1.5 sm:px-3 sm:py-2 overflow-hidden flex flex-col">
    {#if $loading}
      <div class="flex items-center justify-center h-full">
        <div class="text-gray-500">Loading stock data...</div>
      </div>
    {:else if $error}
      <div class="flex items-center justify-center h-full">
        <div class="text-red-500">{$error}</div>
      </div>
    {:else if chartData.length > 0}
      <div class="flex flex-col gap-1.5 sm:gap-2 h-full">
        <div class="flex-shrink-0">
          <PriceDisplay 
            priceData={hoveredPrice} 
            {currentPrice} 
            {priceChange} 
            {percentChange} 
          />
        </div>
        <div class="flex-1 bg-white rounded-xl shadow-xl border border-gray-100 p-2 sm:p-3 min-h-0 overflow-hidden">
          <StockChart 
            data={chartData} 
            symbol={selectedSymbol} 
            onPriceUpdate={handlePriceUpdate}
          />
        </div>
      </div>
    {/if}
  </div>
</main>
