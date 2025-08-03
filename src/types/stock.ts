export interface StockData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CandlestickData {
  x: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface VolumeData {
  x: number;
  y: number;
  color?: string;
}

export interface SMAData {
  x: number;
  y: number;
}

export interface PeriodOption {
  label: string;
  value: string;
  days: number;
}

export interface StockInfo {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}