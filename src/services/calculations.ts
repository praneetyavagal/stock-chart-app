import type { StockData } from '../types/stock';

export function calculateSMA(data: StockData[], period: number): (number | null)[] {
  const sma: (number | null)[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(null);
    } else {
      let sum = 0;
      for (let j = i - period + 1; j <= i; j++) {
        sum += data[j].close;
      }
      sma.push(parseFloat((sum / period).toFixed(2)));
    }
  }
  
  return sma;
}

export function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  return { start, end };
}

export function filterDataByDateRange(data: StockData[], start: Date, end: Date): StockData[] {
  return data.filter(d => d.date >= start && d.date <= end);
}