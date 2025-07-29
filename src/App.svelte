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

<main class="w-full h-screen bg-gray-50 flex flex-col">
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-gray-900">Stock Chart</h1>
          <div class="w-64">
            <StockSelector {selectedSymbol} on:select={handleStockSelect} />
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-4">
          <PeriodSelector on:periodChange={handlePeriodChange} />
          <SMAControls />
        </div>
      </div>
    </div>
  </header>
  
  <div class="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
    {#if $loading}
      <div class="flex items-center justify-center h-full">
        <div class="text-gray-500">Loading stock data...</div>
      </div>
    {:else if $error}
      <div class="flex items-center justify-center h-full">
        <div class="text-red-500">{$error}</div>
      </div>
    {:else if chartData.length > 0}
      <div class="space-y-4 h-full flex flex-col">
        <PriceDisplay 
          priceData={hoveredPrice} 
          {currentPrice} 
          {priceChange} 
          {percentChange} 
        />
        <div class="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
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
