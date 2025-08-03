# Stock Chart - Technical Analysis Tool

A modern, responsive stock chart application built with Svelte, TypeScript, and Highcharts. This application provides candlestick charts with technical analysis features including Simple Moving Averages (SMAs).

## Features

- **Interactive Candlestick Charts**: Professional-grade EOD (End of Day) price charts
- **Multiple Stocks**: Support for IBM, AAPL, GOOGL, MSFT, and AMZN
- **Technical Indicators**: 4 predefined SMAs (20, 50, 100, 200 days)
- **Period Selection**: Predefined periods (1D to 5Y) or custom date range
- **Real-time Price Display**: Hover over chart to see OHLC prices and volume
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Beautiful UI**: Modern, clean interface with smooth animations

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Build

Build for production:

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Select a Stock**: Use the search bar to select from available stocks
2. **Choose Time Period**: Select predefined periods or use custom date picker
3. **Toggle SMAs**: Enable/disable moving averages to analyze trends
4. **View Price Data**: Hover over the chart to see detailed price information

## Technical Stack

- **Framework**: Svelte + TypeScript
- **Charting**: Highcharts (Stock module)
- **Date Handling**: Day.js
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Architecture

- `/src/components/`: Reusable Svelte components
- `/src/services/`: Data fetching and business logic
- `/src/types/`: TypeScript type definitions
- `/src/utils/`: Utility functions for formatting

## Note

This demo uses generated dummy data for demonstration purposes. In production, you would integrate with real-time stock data APIs.