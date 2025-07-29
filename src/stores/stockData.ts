import { writable } from 'svelte/store';
import type { StockQuote, PeriodOption, SMAOption } from '../types/stock';

export const currentStock = writable<StockQuote | null>(null);
export const selectedPeriod = writable<PeriodOption>({ label: '1Y', value: '1Y', days: 365 });
export const loading = writable(false);
export const error = writable<string | null>(null);

export const smaOptions = writable<SMAOption[]>([
  { period: 20, color: '#3b82f6', enabled: false },
  { period: 50, color: '#8b5cf6', enabled: false },
  { period: 100, color: '#ec4899', enabled: false },
  { period: 200, color: '#f97316', enabled: false }
]);

export const periodOptions: PeriodOption[] = [
  { label: '1M', value: '1M', days: 30 },
  { label: '3M', value: '3M', days: 90 },
  { label: '6M', value: '6M', days: 180 },
  { label: '1Y', value: '1Y', days: 365 },
  { label: '5Y', value: '5Y', days: 1825 },
  { label: 'Custom', value: 'custom' }
];