import axios from 'axios';
import dayjs from 'dayjs';
import type { StockData } from '../types/stock';

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const ALPHA_VANTAGE_API_KEY = 'demo'; // Using demo key for demonstration

export async function fetchStockData(
  symbol: string,
  startDate: Date,
  endDate: Date
): Promise<StockData[]> {
  try {
    // For demo purposes, we'll generate realistic-looking dummy data
    // In production, you would use a real API like Alpha Vantage or Yahoo Finance
    return generateDummyData(symbol, startDate, endDate);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
}

function generateDummyData(
  symbol: string,
  startDate: Date,
  endDate: Date
): StockData[] {
  const data: StockData[] = [];
  const days = dayjs(endDate).diff(dayjs(startDate), 'day');
  
  // Different base prices for different symbols
  const basePrices: { [key: string]: number } = {
    'AAPL': 175,
    'GOOGL': 140,
    'MSFT': 380,
    'AMZN': 170,
    'IBM': 280  // Using IBM as shown in the sample
  };
  
  let basePrice = basePrices[symbol] || 100;
  let currentDate = dayjs(startDate);
  
  for (let i = 0; i <= days; i++) {
    // Skip weekends
    if (currentDate.day() === 0 || currentDate.day() === 6) {
      currentDate = currentDate.add(1, 'day');
      continue;
    }
    
    // Generate realistic price movements
    const volatility = 0.02;
    const trend = symbol === 'IBM' ? 0.0003 : 0.0001; // IBM has upward trend as shown in sample
    const randomChange = (Math.random() - 0.5) * 2 * volatility;
    
    basePrice = basePrice * (1 + randomChange + trend);
    
    const open = basePrice * (1 + (Math.random() - 0.5) * 0.01);
    const close = basePrice * (1 + (Math.random() - 0.5) * 0.01);
    const high = Math.max(open, close) * (1 + Math.random() * 0.005);
    const low = Math.min(open, close) * (1 - Math.random() * 0.005);
    const volume = Math.floor(10000000 + Math.random() * 5000000);
    
    data.push({
      timestamp: currentDate.valueOf(),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume
    });
    
    currentDate = currentDate.add(1, 'day');
  }
  
  return data;
}

export function calculateSMA(data: StockData[], period: number): { x: number; y: number }[] {
  const smaData: { x: number; y: number }[] = [];
  
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    smaData.push({
      x: data[i].timestamp,
      y: parseFloat((sum / period).toFixed(2))
    });
  }
  
  return smaData;
}