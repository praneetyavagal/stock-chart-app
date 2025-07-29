import type { Options } from 'highcharts';
import type { StockData } from '../types/stock';

export function getChartOptions(
  data: StockData[], 
  symbol: string,
  onCrosshairMove?: (price: any) => void
): Options {
  const ohlcData = data.map(d => [
    d.date.getTime(),
    d.open,
    d.high,
    d.low,
    d.close
  ]);

  const volumeData = data.map(d => [
    d.date.getTime(),
    d.volume
  ]);

  return {
    chart: {
      height: '70%',
      backgroundColor: '#ffffff',
      style: {
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }
    },
    title: {
      text: symbol,
      align: 'left',
      style: {
        fontSize: '24px',
        fontWeight: 'bold'
      }
    },
    credits: {
      enabled: false
    },
    xAxis: {
      type: 'datetime',
      crosshair: {
        width: 1,
        color: '#333',
        dashStyle: 'ShortDash'
      }
    },
    yAxis: [{
      labels: {
        align: 'right',
        x: -3
      },
      title: {
        text: 'Price ($)'
      },
      height: '75%',
      lineWidth: 1,
      resize: {
        enabled: true
      },
      crosshair: {
        width: 1,
        color: '#333',
        dashStyle: 'ShortDash'
      }
    }, {
      labels: {
        align: 'right',
        x: -3
      },
      title: {
        text: 'Volume'
      },
      top: '75%',
      height: '25%',
      offset: 0,
      lineWidth: 1
    }],
    tooltip: {
      split: true,
      borderColor: '#333',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      style: {
        fontSize: '12px'
      },
      positioner: function() {
        return { x: 10, y: 30 };
      },
      formatter: function() {
        if (onCrosshairMove && this.points) {
          const point = this.points[0];
          onCrosshairMove({
            date: point.x,
            open: point.point.open,
            high: point.point.high,
            low: point.point.low,
            close: point.point.close,
            volume: this.points[1]?.y || 0
          });
        }
        return false;
      }
    },
    plotOptions: {
      candlestick: {
        color: '#ef4444',
        upColor: '#22c55e',
        lineColor: '#ef4444',
        upLineColor: '#22c55e'
      },
      column: {
        color: '#94a3b8'
      },
      series: {
        animation: false,
        marker: {
          enabled: false
        }
      }
    },
    series: [{
      type: 'candlestick',
      name: symbol,
      data: ohlcData,
      yAxis: 0,
      tooltip: {
        valueDecimals: 2
      }
    }, {
      type: 'column',
      name: 'Volume',
      data: volumeData,
      yAxis: 1,
      tooltip: {
        valueDecimals: 0
      }
    }],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 768
        },
        chartOptions: {
          chart: {
            height: '60%'
          },
          yAxis: [{
            labels: {
              align: 'left',
              x: 3
            }
          }, {
            labels: {
              align: 'left',
              x: 3
            }
          }]
        }
      }]
    }
  };
}