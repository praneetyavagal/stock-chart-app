<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Highcharts from 'highcharts/highstock';
  import { currentStock, smaOptions } from '../stores/stockData';
  import { calculateSMA } from '../services/calculations';
  import { getChartOptions } from '../services/chartConfig';
  import type { StockData } from '../types/stock';
  
  export let data: StockData[] = [];
  export let symbol: string = '';
  export let onPriceUpdate: (price: any) => void = () => {};
  
  let chartContainer: HTMLDivElement;
  let chart: Highcharts.Chart | null = null;
  let currentSmaOptions: typeof $smaOptions = [];
  
  $: if (chart && data.length > 0) {
    updateChart(data, symbol);
  }
  
  $: if (chart && $smaOptions !== currentSmaOptions) {
    currentSmaOptions = $smaOptions;
    updateSMALines();
  }
  
  function updateChart(newData: StockData[], newSymbol: string) {
    if (!chart) return;
    
    const options = getChartOptions(newData, newSymbol, onPriceUpdate);
    chart.update(options, true, true);
    updateSMALines();
  }
  
  function updateSMALines() {
    if (!chart || !data.length) return;
    
    // Remove existing SMA series
    const seriesToRemove = chart.series.filter(s => 
      s.name && s.name.includes('SMA')
    );
    seriesToRemove.forEach(s => s.remove(false));
    
    // Add enabled SMA lines
    $smaOptions.forEach(sma => {
      if (sma.enabled) {
        const smaData = calculateSMA(data, sma.period);
        const smaPoints = data.map((d, i) => [
          d.date.getTime(),
          smaData[i]
        ]).filter(p => p[1] !== null);
        
        chart.addSeries({
          type: 'line',
          name: `SMA(${sma.period})`,
          data: smaPoints,
          color: sma.color,
          lineWidth: 2,
          yAxis: 0,
          tooltip: {
            valueDecimals: 2
          }
        }, false);
      }
    });
    
    chart.redraw();
  }
  
  function handleResize() {
    if (chart) {
      chart.reflow();
    }
  }
  
  onMount(() => {
    if (chartContainer) {
      const options = getChartOptions(data, symbol, onPriceUpdate);
      chart = Highcharts.chart(chartContainer, options);
      window.addEventListener('resize', handleResize);
    }
  });
  
  onDestroy(() => {
    if (chart) {
      chart.destroy();
      chart = null;
    }
    window.removeEventListener('resize', handleResize);
  });
</script>

<div bind:this={chartContainer} class="w-full h-full"></div>