export interface StockData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockQuote {
  symbol: string;
  name: string;
  data: StockData[];
}

export interface PeriodOption {
  label: string;
  value: string;
  days?: number;
}

export interface SMAOption {
  period: number;
  color: string;
  enabled: boolean;
}

export interface ChartPriceData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma20?: number;
  sma50?: number;
  sma100?: number;
  sma200?: number;
}