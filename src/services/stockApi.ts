import type { StockData, StockQuote } from '../types/stock';
import { subDays, format } from 'date-fns';

const API_KEY = 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';

export async function fetchStockData(symbol: string, days: number = 365): Promise<StockQuote> {
  try {
    const mockData = generateMockData(symbol, days);
    return {
      symbol,
      name: symbol === 'AAPL' ? 'Apple Inc.' : 'International Business Machines',
      data: mockData
    };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
}

export async function searchSymbols(query: string): Promise<{ symbol: string; name: string }[]> {
  const mockSymbols = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'IBM', name: 'International Business Machines' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' }
  ];
  
  return mockSymbols.filter(s => 
    s.symbol.toLowerCase().includes(query.toLowerCase()) ||
    s.name.toLowerCase().includes(query.toLowerCase())
  );
}

function generateMockData(symbol: string, days: number): StockData[] {
  const data: StockData[] = [];
  const endDate = new Date();
  const startDate = subDays(endDate, days);
  
  let basePrice = symbol === 'AAPL' ? 150 : 120;
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      const volatility = 0.02;
      const trend = 0.0002;
      const change = (Math.random() - 0.5) * volatility + trend;
      
      basePrice *= (1 + change);
      
      const dayVolatility = Math.random() * 0.015;
      const open = basePrice * (1 + (Math.random() - 0.5) * dayVolatility);
      const close = basePrice * (1 + (Math.random() - 0.5) * dayVolatility);
      const high = Math.max(open, close) * (1 + Math.random() * dayVolatility);
      const low = Math.min(open, close) * (1 - Math.random() * dayVolatility);
      const volume = Math.floor(10000000 + Math.random() * 50000000);
      
      data.push({
        date: new Date(currentDate),
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
}