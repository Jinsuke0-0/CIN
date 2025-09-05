"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNotes } from '@/lib/hooks';

// 1. Define the shape of the context data
interface PerformanceMetrics {
  totalBuyVolume: number;
  totalSellVolume: number;
  averageTradeSize: number;
  totalTrades: number;
}

interface PortfolioContextType {
  metrics: PerformanceMetrics;
  loading: boolean;
  allTrades: Trade[]; // Add this line
}

// Create the context with a default value
const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// 2. Create the Provider component
interface PortfolioProviderProps {
  children: ReactNode;
}

export function PortfolioProvider({ children }: PortfolioProviderProps) {
  const { notes } = useNotes();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({ 
    totalBuyVolume: 0, 
    totalSellVolume: 0, 
    averageTradeSize: 0, 
    totalTrades: 0 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("--- Portfolio Calculation Started ---");
    setLoading(true);

    let totalTrades = 0;
    let totalBuyVolume = 0;
    let totalSellVolume = 0;

    console.log("Raw notes data:", notes);

    notes.forEach(note => {
      if (!note.trades || note.trades.length === 0) return;
      
      console.log(`Processing trades for note: "${note.title}"`);
      totalTrades += note.trades.length;

      note.trades.forEach(trade => {
        console.log("  - Processing trade:", trade);
        console.log("  - Trade type:", trade.type); // Add this line for debugging
        const amount = parseFloat(trade.amount);
        const price = parseFloat(trade.price);

        if (!isNaN(amount) && !isNaN(price)) {
          const volume = amount * price;
          console.log(`    > Calculated volume: ${amount} * ${price} = ${volume}`);
          if (trade.type === 'buy') {
            totalBuyVolume += volume;
          } else {
            totalSellVolume += volume;
          }
        } else {
          console.warn("    > Skipping trade due to invalid amount or price.", { amount, price });
        }
      });
    });

    const totalTradeVolume = totalBuyVolume + totalSellVolume;
    const averageTradeSize = totalTrades > 0 ? totalTradeVolume / totalTrades : 0;

    const finalMetrics = { totalBuyVolume, totalSellVolume, averageTradeSize, totalTrades };
    console.log("Final calculated metrics:", finalMetrics);
    console.log("--- Portfolio Calculation Finished ---");

    setMetrics(finalMetrics);
    setLoading(false);

  }, [notes]);

  // Collect all trades from all notes
  const allTrades = notes.flatMap(note => note.trades || []);

  const value = {
    metrics,
    loading,
    allTrades, // Pass all trades
    // Provide default empty values for other components that might use the context
    holdings: [],
    chartData: [],
    error: null,
  };

  return <PortfolioContext.Provider value={value as any}>{children}</PortfolioContext.Provider>;
}

// 3. Create the custom hook
export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
