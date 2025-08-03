<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Highcharts from 'highcharts/highstock';
  import type { StockData, CandlestickData, VolumeData } from '../types/stock';
  import { calculateSMA } from '../services/stockData';
  import { formatPrice, formatVolume, formatDate } from '../utils/formatters';

  export let data: StockData[] = [];
  export let symbol: string = 'AAPL';
  export let enabledSMAs: Set<number> = new Set();

  let chartContainer: HTMLElement;
  let chart: Highcharts.Chart | null = null;
  let hoveredPrice: { ohlc: any; volume: number; smas: { [key: number]: number } } | null = null;

  const smaColors = {
    20: '#2196F3',
    50: '#9C27B0',
    100: '#FF9800',
    200: '#4CAF50'
  };

  $: if (chart && data.length > 0) {
    updateChart();
  }

  function prepareChartData() {
    const ohlcData: CandlestickData[] = [];
    const volumeData: VolumeData[] = [];

    data.forEach((point) => {
      ohlcData.push({
        x: point.timestamp,
        open: point.open,
        high: point.high,
        low: point.low,
        close: point.close
      });

      volumeData.push({
        x: point.timestamp,
        y: point.volume,
        color: point.close >= point.open ? '#4CAF50' : '#F44336'
      });
    });

    return { ohlcData, volumeData };
  }

  function updateChart() {
    if (!chart || data.length === 0) return;

    const { ohlcData, volumeData } = prepareChartData();
    
    // Update OHLC series
    chart.series[0].setData(ohlcData);
    
    // Update volume series
    chart.series[1].setData(volumeData);

    // Update SMA series
    const smaIndices = [20, 50, 100, 200];
    smaIndices.forEach((period, index) => {
      const seriesIndex = index + 2;
      if (enabledSMAs.has(period)) {
        const smaData = calculateSMA(data, period);
        if (chart.series[seriesIndex]) {
          chart.series[seriesIndex].setData(smaData);
          chart.series[seriesIndex].show();
        }
      } else if (chart.series[seriesIndex]) {
        chart.series[seriesIndex].hide();
      }
    });
  }

  function createChart() {
    const { ohlcData, volumeData } = prepareChartData();

    const options: Highcharts.Options = {
      chart: {
        height: 600,
        backgroundColor: '#ffffff',
        style: {
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }
      },
      rangeSelector: {
        enabled: false
      },
      title: {
        text: null
      },
      credits: {
        enabled: false
      },
      xAxis: {
        type: 'datetime',
        labels: {
          formatter: function() {
            return Highcharts.dateFormat('%b %e', this.value as number);
          }
        }
      },
      yAxis: [{
        labels: {
          align: 'left',
          x: 10
        },
        height: '70%',
        lineWidth: 1,
        gridLineWidth: 1,
        gridLineColor: '#f0f0f0'
      }, {
        labels: {
          align: 'left',
          x: 10
        },
        top: '75%',
        height: '25%',
        offset: 0,
        lineWidth: 1,
        gridLineWidth: 1,
        gridLineColor: '#f0f0f0'
      }],
      tooltip: {
        enabled: false
      },
      plotOptions: {
        series: {
          point: {
            events: {
              mouseOver: function() {
                const point = this as any;
                const smas: { [key: number]: number } = {};
                
                [20, 50, 100, 200].forEach((period, index) => {
                  const seriesIndex = index + 2;
                  if (chart && chart.series[seriesIndex] && enabledSMAs.has(period)) {
                    const smaPoint = chart.series[seriesIndex].data.find(
                      (p: any) => Math.abs(p.x - point.x) < 86400000
                    );
                    if (smaPoint) {
                      smas[period] = smaPoint.y;
                    }
                  }
                });

                const volumePoint = chart?.series[1].data.find(
                  (p: any) => p.x === point.x
                );

                hoveredPrice = {
                  ohlc: point,
                  volume: volumePoint?.y || 0,
                  smas
                };
              }
            }
          }
        }
      },
      series: [{
        type: 'candlestick',
        name: symbol,
        data: ohlcData,
        color: '#F44336',
        upColor: '#4CAF50',
        lineColor: '#F44336',
        upLineColor: '#4CAF50',
        yAxis: 0
      }, {
        type: 'column',
        name: 'Volume',
        data: volumeData,
        yAxis: 1,
        color: '#cccccc'
      }, {
        type: 'line',
        name: 'SMA(20)',
        data: calculateSMA(data, 20),
        color: smaColors[20],
        lineWidth: 2,
        visible: enabledSMAs.has(20),
        yAxis: 0
      }, {
        type: 'line',
        name: 'SMA(50)',
        data: calculateSMA(data, 50),
        color: smaColors[50],
        lineWidth: 2,
        visible: enabledSMAs.has(50),
        yAxis: 0
      }, {
        type: 'line',
        name: 'SMA(100)',
        data: calculateSMA(data, 100),
        color: smaColors[100],
        lineWidth: 2,
        visible: enabledSMAs.has(100),
        yAxis: 0
      }, {
        type: 'line',
        name: 'SMA(200)',
        data: calculateSMA(data, 200),
        color: smaColors[200],
        lineWidth: 2,
        visible: enabledSMAs.has(200),
        yAxis: 0
      }]
    };

    chart = Highcharts.stockChart(chartContainer, options);
  }

  onMount(() => {
    createChart();
    
    // Handle window resize
    const handleResize = () => {
      if (chart) {
        chart.reflow();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  onDestroy(() => {
    if (chart) {
      chart.destroy();
    }
  });
</script>

<div class="chart-wrapper">
  <div bind:this={chartContainer} class="chart-container"></div>
  
  {#if hoveredPrice}
    <div class="price-display">
      <div class="price-row">
        <span class="label">O:</span>
        <span class="value">{formatPrice(hoveredPrice.ohlc.open)}</span>
        <span class="label">H:</span>
        <span class="value">{formatPrice(hoveredPrice.ohlc.high)}</span>
        <span class="label">L:</span>
        <span class="value">{formatPrice(hoveredPrice.ohlc.low)}</span>
        <span class="label">C:</span>
        <span class="value">{formatPrice(hoveredPrice.ohlc.close)}</span>
        <span class="label">Vol:</span>
        <span class="value">{formatVolume(hoveredPrice.volume)}</span>
      </div>
      <div class="sma-row">
        {#each Object.entries(hoveredPrice.smas) as [period, value]}
          <span class="sma-item" style="color: {smaColors[Number(period)]}">
            SMA({period}): {formatPrice(value)}
          </span>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .chart-wrapper {
    position: relative;
    width: 100%;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }

  .chart-container {
    width: 100%;
    height: 600px;
  }

  .price-display {
    position: absolute;
    top: 30px;
    left: 30px;
    background: rgba(255, 255, 255, 0.95);
    padding: 10px 15px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 13px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  .price-row {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 5px;
  }

  .sma-row {
    display: flex;
    gap: 15px;
    align-items: center;
  }

  .label {
    color: #dc3545;
    font-weight: 500;
  }

  .value {
    color: #dc3545;
    font-weight: 600;
  }

  .sma-item {
    font-weight: 500;
  }
</style>