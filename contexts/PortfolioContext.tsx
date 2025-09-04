"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNotes } from '@/lib/hooks';

// 1. Define the shape of the context data
interface PerformanceMetrics {
  totalTradeVolume: number;
  totalTrades: number;
}

interface PortfolioContextType {
  metrics: PerformanceMetrics;
  loading: boolean;
}

// Create the context with a default value
const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// 2. Create the Provider component
interface PortfolioProviderProps {
  children: ReactNode;
}

export function PortfolioProvider({ children }: PortfolioProviderProps) {
  const { notes } = useNotes();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({ totalTradeVolume: 0, totalTrades: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    let totalTrades = 0;
    let totalTradeVolume = 0;

    notes.forEach(note => {
      if (!note.trades) return;
      totalTrades += note.trades.length;
      note.trades.forEach(trade => {
        const amount = parseFloat(trade.amount);
        const price = parseFloat(trade.price);
        if (!isNaN(amount) && !isNaN(price)) {
          totalTradeVolume += amount * price;
        }
      });
    });

    setMetrics({ totalTrades, totalTradeVolume });
    setLoading(false);

  }, [notes]);

  // Note: The other components (AssetAllocation, PortfolioChart) will now receive empty/default data 
  // as we have removed holdings, chartData etc. to simplify.
  const value = {
    metrics,
    loading,
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
