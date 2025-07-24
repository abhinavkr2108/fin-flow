import axios, { AxiosInstance } from "axios";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  CoinGeckoPrice,
  CoinGeckoHistoricalData,
  CoinGeckoOHLC,
  SupportedCoin,
  ProcessedCryptoData,
} from "./types/market";

class CryptoApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "https://api.coingecko.com/api/v3",
      timeout: 10000,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`Making request to: ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async getCurrentPrice(coinId: string): Promise<CoinGeckoPrice | null> {
    try {
      const response = await this.client.get("/coins/markets", {
        params: {
          vs_currency: "usd",
          ids: coinId,
          order: "market_cap_desc",
          per_page: 1,
          page: 1,
          sparkline: false,
          price_change_percentage: "24h",
        },
      });

      return response.data[0] || null;
    } catch (error) {
      console.error("Error fetching current price:", error);
      throw error;
    }
  }

  async getOHLCData(
    coinId: string,
    days: number = 90
  ): Promise<[number, number, number, number, number][] | null> {
    try {
      const response = await this.client.get(`/coins/${coinId}/ohlc`, {
        params: {
          vs_currency: "usd",
          days,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching OHLC data:", error);
      throw error;
    }
  }

  async getHistoricalData(
    coinId: string,
    days: number = 90
  ): Promise<CoinGeckoHistoricalData | null> {
    try {
      const response = await this.client.get(`/coins/${coinId}/market_chart`, {
        params: {
          vs_currency: "usd",
          days,
          interval: "daily",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching historical data:", error);
      throw error;
    }
  }

  async getSupportedCoins(): Promise<SupportedCoin[]> {
    try {
      const response = await this.client.get("/coins/list");

      // Filter to popular coins only
      const popularCoins = [
        "bitcoin",
        "ethereum",
        "binancecoin",
        "cardano",
        "solana",
        "polkadot",
        "dogecoin",
        "avalanche-2",
        "polygon",
        "chainlink",
      ];

      return response.data.filter((coin: SupportedCoin) =>
        popularCoins.includes(coin.id)
      );
    } catch (error) {
      console.error("Error fetching supported coins:", error);
      throw error;
    }
  }

  private calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100;

    const rs = avgGain / avgLoss;
    return 100 - 100 / (1 + rs);
  }

  private calculateMovingAverage(values: number[], period: number): number {
    if (values.length < period) return values[values.length - 1] || 0;

    const slice = values.slice(-period);
    return slice.reduce((sum, val) => sum + val, 0) / slice.length;
  }

  private calculateVolatility(prices: number[], period: number = 20): number {
    if (prices.length < 2) return 0;

    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }

    if (returns.length === 0) return 0;

    const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance =
      returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) /
      returns.length;

    return Math.sqrt(variance * 365); // Annualized volatility
  }

  private calculateLiquidityScore(
    volume: number,
    marketCap: number,
    priceChange: number
  ): number {
    const volumeRatio = volume / marketCap;
    const volatilityPenalty = Math.abs(priceChange) / 100;

    const liquidityScore = Math.min(volumeRatio * 10, 1) - volatilityPenalty;
    return Math.max(0, Math.min(1, liquidityScore));
  }

  async processHistoricalData(
    coinId: string,
    days: number = 90
  ): Promise<Record<string, ProcessedCryptoData>> {
    try {
      // Fetch both OHLC and market data in parallel
      const [ohlcData, historicalData] = await Promise.all([
        this.getOHLCData(coinId, days),
        this.getHistoricalData(coinId, days),
      ]);

      if (!ohlcData || !historicalData) return {};

      const processedData: Record<string, ProcessedCryptoData> = {};
      const { market_caps, total_volumes } = historicalData;

      // Create lookup maps for market cap and volume by timestamp
      const marketCapMap = new Map(
        market_caps.map(([timestamp, marketCap]) => [timestamp, marketCap])
      );
      const volumeMap = new Map(
        total_volumes.map(([timestamp, volume]) => [timestamp, volume])
      );

      // Extract close prices for calculations
      const closePrices = ohlcData.map(([, , , , close]) => close);
      const volumes = ohlcData.map(
        ([timestamp]) => volumeMap.get(timestamp) || 0
      );

      for (let i = 0; i < ohlcData.length; i++) {
        const [timestamp, open, high, low, close] = ohlcData[i];

        const date = new Date(timestamp);
        const dateKey = date.toISOString().split("T")[0];

        // Get market cap and volume for this timestamp
        const marketCap = marketCapMap.get(timestamp) || 0;
        const volume = volumeMap.get(timestamp) || 0;

        // Calculate price change
        const priceChange =
          i > 0 ? (close - closePrices[i - 1]) / closePrices[i - 1] : 0;
        const priceChangePercent = priceChange * 100;

        // Calculate volatility using recent close prices
        const recentPrices = closePrices.slice(Math.max(0, i - 19), i + 1);
        const volatility = this.calculateVolatility(recentPrices);

        // Calculate RSI using close prices
        const rsiPrices = closePrices.slice(Math.max(0, i - 14), i + 1);
        const rsi = this.calculateRSI(rsiPrices);

        // Calculate moving averages
        const movingAverage = this.calculateMovingAverage(
          closePrices.slice(0, i + 1),
          20
        );
        const volumeMA = this.calculateMovingAverage(
          volumes.slice(0, i + 1),
          20
        );

        // Calculate liquidity score
        const liquidityScore = this.calculateLiquidityScore(
          volume,
          marketCap,
          priceChangePercent
        );

        processedData[dateKey] = {
          date: dateKey,
          open,
          close,
          high,
          low,
          volume,
          marketCap,
          volatility,
          liquidity: liquidityScore,
          priceChange,
          priceChangePercent,
          rsi,
          movingAverage,
          volumeMA,
          liquidityScore,
        };
      }

      return processedData;
    } catch (error) {
      console.error("Error processing historical data:", error);
      throw error;
    }
  }
}

// Create singleton instance
export const cryptoApi = new CryptoApiService();

// Query Keys
export const cryptoQueryKeys = {
  all: ["crypto"] as const,
  currentPrice: (coinId: string) =>
    [...cryptoQueryKeys.all, "currentPrice", coinId] as const,
  ohlcData: (coinId: string, days: number) =>
    [...cryptoQueryKeys.all, "ohlc", coinId, days] as const,
  historicalData: (coinId: string, days: number) =>
    [...cryptoQueryKeys.all, "historical", coinId, days] as const,
  processedData: (coinId: string, days: number) =>
    [...cryptoQueryKeys.all, "processed", coinId, days] as const,
  supportedCoins: () => [...cryptoQueryKeys.all, "supportedCoins"] as const,
};

// TanStack Query Hooks
export const useCoinPrice = (
  coinId: string
): UseQueryResult<CoinGeckoPrice | null, Error> => {
  return useQuery({
    queryKey: cryptoQueryKeys.currentPrice(coinId),
    queryFn: () => cryptoApi.getCurrentPrice(coinId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!coinId,
  });
};

export const useOHLCData = (
  coinId: string,
  days: number = 90
): UseQueryResult<[number, number, number, number, number][] | null, Error> => {
  return useQuery({
    queryKey: cryptoQueryKeys.ohlcData(coinId, days),
    queryFn: () => cryptoApi.getOHLCData(coinId, days),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!coinId,
  });
};

export const useHistoricalData = (
  coinId: string,
  days: number = 90
): UseQueryResult<CoinGeckoHistoricalData | null, Error> => {
  return useQuery({
    queryKey: cryptoQueryKeys.historicalData(coinId, days),
    queryFn: () => cryptoApi.getHistoricalData(coinId, days),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!coinId,
  });
};

export const useProcessedCryptoData = (
  coinId: string,
  days: number = 90
): UseQueryResult<Record<string, ProcessedCryptoData>, Error> => {
  return useQuery({
    queryKey: cryptoQueryKeys.processedData(coinId, days),
    queryFn: () => cryptoApi.processHistoricalData(coinId, days),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!coinId,
  });
};

export const useSupportedCoins = (): UseQueryResult<SupportedCoin[], Error> => {
  return useQuery({
    queryKey: cryptoQueryKeys.supportedCoins(),
    queryFn: () => cryptoApi.getSupportedCoins(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
