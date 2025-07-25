/* eslint-disable @typescript-eslint/no-explicit-any */

export interface CoinGeckoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: any;
  last_updated: string;
}

export interface CoinGeckoHistoricalData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface CoinGeckoOHLC {
  data: [number, number, number, number, number][];
}

export interface ProcessedCryptoData {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  marketCap: number;
  volatility: number;
  liquidity: number;
  priceChange: number;
  priceChangePercent: number;
  rsi: number;
  movingAverage: number;
  volumeMA: number;
  liquidityScore: number;
}

export interface SupportedCoin {
  id: string;
  symbol: string;
  name: string;
}
