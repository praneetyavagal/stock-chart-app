<script lang="ts">
  import { onMount } from 'svelte';
  import dayjs from 'dayjs';
  import StockChart from './components/StockChart.svelte';
  import StockSelector from './components/StockSelector.svelte';
  import PeriodSelector from './components/PeriodSelector.svelte';
  import SMAToggles from './components/SMAToggles.svelte';
  import { fetchStockData } from './services/stockData';
  import { formatPrice, formatChange, formatPercent } from './utils/formatters';
  import type { StockData, StockInfo } from './types/stock';

  let selectedSymbol = 'IBM';
  let stockData: StockData[] = [];
  let stockInfo: StockInfo | null = null;
  let enabledSMAs = new Set<number>([20, 50]);
  let startDate = dayjs().subtract(1, 'year').toDate();
  let endDate = new Date();
  let loading = false;
  let error = '';

  async function loadStockData() {
    loading = true;
    error = '';
    
    try {
      stockData = await fetchStockData(selectedSymbol, startDate, endDate);
      
      if (stockData.length > 0) {
        const latestData = stockData[stockData.length - 1];
        const previousData = stockData[stockData.length - 2];
        const change = latestData.close - previousData.close;
        const changePercent = (change / previousData.close) * 100;
        
        stockInfo = {
          symbol: selectedSymbol,
          name: getStockName(selectedSymbol),
          price: latestData.close,
          change,
          changePercent
        };
      }
    } catch (err) {
      error = 'Failed to load stock data. Please try again.';
      console.error(err);
    } finally {
      loading = false;
    }
  }

  function getStockName(symbol: string): string {
    const names: { [key: string]: string } = {
      'IBM': 'International Business Machines',
      'AAPL': 'Apple Inc.',
      'GOOGL': 'Alphabet Inc.',
      'MSFT': 'Microsoft Corporation',
      'AMZN': 'Amazon.com Inc.'
    };
    return names[symbol] || symbol;
  }

  function handleStockChange(event: CustomEvent<string>) {
    selectedSymbol = event.detail;
    loadStockData();
  }

  function handlePeriodChange(event: CustomEvent<{ startDate: Date; endDate: Date }>) {
    startDate = event.detail.startDate;
    endDate = event.detail.endDate;
    loadStockData();
  }

  function handleSMAChange(event: CustomEvent<Set<number>>) {
    enabledSMAs = event.detail;
  }

  onMount(() => {
    loadStockData();
  });
</script>

<main>
  <div class="app-container">
    <header class="app-header">
      <h1 class="app-title">Stock Chart</h1>
      <div class="header-controls">
        <StockSelector 
          {selectedSymbol}
          on:change={handleStockChange}
        />
      </div>
    </header>

    {#if stockInfo}
      <div class="stock-info-card">
        <div class="stock-info-main">
          <h2 class="stock-symbol">{stockInfo.symbol}</h2>
          <p class="stock-name">{stockInfo.name}</p>
        </div>
        <div class="stock-price-info">
          <div class="current-price">${formatPrice(stockInfo.price)}</div>
          <div class="price-change" class:positive={stockInfo.change >= 0} class:negative={stockInfo.change < 0}>
            <span class="change-amount">{formatChange(stockInfo.change)}</span>
            <span class="change-percent">({formatPercent(stockInfo.changePercent)})</span>
          </div>
        </div>
      </div>
    {/if}

    <div class="controls-section">
      <PeriodSelector
        {startDate}
        {endDate}
        on:change={handlePeriodChange}
      />
      <SMAToggles
        {enabledSMAs}
        on:change={handleSMAChange}
      />
    </div>

    {#if loading}
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading stock data...</p>
      </div>
    {:else if error}
      <div class="error-container">
        <p>{error}</p>
      </div>
    {:else if stockData.length > 0}
      <StockChart
        data={stockData}
        symbol={selectedSymbol}
        {enabledSMAs}
      />
    {/if}
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: #f5f7fa;
    color: #333;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .app-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
  }

  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 20px;
  }

  .app-title {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0;
    flex-shrink: 0;
  }

  .header-controls {
    flex: 1;
    max-width: 450px;
    min-width: 250px;
  }

  .stock-info-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 30px;
  }

  .stock-info-main {
    flex: 1;
    min-width: 200px;
  }

  .stock-symbol {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 4px 0;
    color: #1a1a1a;
  }

  .stock-name {
    font-size: 14px;
    color: #666;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 300px;
  }

  .stock-price-info {
    text-align: right;
    min-width: 150px;
    flex-shrink: 0;
  }

  .current-price {
    font-size: 32px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 4px;
    white-space: nowrap;
  }

  .price-change {
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: flex-end;
    white-space: nowrap;
  }

  .price-change.positive {
    color: #4CAF50;
  }

  .price-change.negative {
    color: #F44336;
  }

  .controls-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 20px;
  }

  .loading-container,
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #2196F3;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading-container p,
  .error-container p {
    margin: 0;
    font-size: 16px;
    color: #666;
  }

  .error-container p {
    color: #F44336;
  }

  @media (max-width: 768px) {
    .app-container {
      padding: 15px;
    }

    .app-header {
      flex-direction: column;
      align-items: stretch;
    }

    .header-controls {
      max-width: none;
    }

    .stock-info-card {
      flex-direction: column;
      align-items: stretch;
      text-align: center;
      gap: 20px;
    }

    .stock-info-main {
      min-width: unset;
    }

    .stock-name {
      max-width: 100%;
    }

    .stock-price-info {
      text-align: center;
      min-width: unset;
    }

    .current-price {
      font-size: 28px;
    }

    .price-change {
      justify-content: center;
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    .current-price {
      font-size: 24px;
    }

    .stock-symbol {
      font-size: 20px;
    }

    .stock-info-card {
      padding: 16px;
    }
  }
</style>
