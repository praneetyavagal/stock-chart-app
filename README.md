# Stock Chart App

A responsive web application for viewing stock price charts with technical indicators, built using Svelte and Highcharts.

![Stock Chart App](https://img.shields.io/badge/Svelte-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Highcharts](https://img.shields.io/badge/Highcharts-8085E9?style=for-the-badge&logo=highcharts&logoColor=white)

## Features

- 📊 Interactive candlestick charts for stock prices
- 📈 Simple Moving Averages (SMA) - 20, 50, 100, and 200 day periods
- 📅 Predefined time periods (1M, 3M, 6M, 1Y, 5Y) and custom date range selector
- 🔍 Real-time price tracking with cursor hover
- 📱 Fully responsive design
- 🔄 Multiple stock support with search functionality
- 📊 Volume chart below price chart

## Technologies Used

- **Framework**: Svelte with TypeScript
- **Charting**: Highcharts
- **Styling**: Tailwind CSS
- **Date Handling**: date-fns
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v20.19.0 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/praneetsy/stock-chart-app.git
cd stock-chart-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Select a Stock**: Use the search bar to find and select a stock symbol (default: AAPL)
2. **Choose Time Period**: Click on predefined periods or use "Custom" for specific date ranges
3. **Toggle SMAs**: Click on SMA buttons to show/hide moving averages
4. **Track Prices**: Hover over the chart to see detailed price information

## Project Structure

```
src/
├── components/
│   ├── StockChart.svelte      # Main chart component
│   ├── SMAControls.svelte     # SMA toggle controls
│   ├── PeriodSelector.svelte  # Time period selection
│   ├── PriceDisplay.svelte    # Price information display
│   └── StockSelector.svelte   # Stock search and selection
├── services/
│   ├── stockApi.ts           # Stock data fetching
│   ├── calculations.ts       # SMA and data calculations
│   └── chartConfig.ts        # Highcharts configuration
├── stores/
│   └── stockData.ts          # Svelte stores for state management
├── types/
│   └── stock.ts              # TypeScript type definitions
└── App.svelte                # Root component
```

## Deployment

This app can be deployed to various platforms:

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy with automatic settings

### Netlify
1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to Netlify

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).