"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { usePortfolio } from '@/contexts/PortfolioContext'; // Import usePortfolio
import { useEffect, useState } from 'react'; // Import useEffect and useState


interface AssetData {
  name: string
  value: number
  percentage: number
  color: string
}

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
];

export function AssetAllocation() {
  const { allTrades, loading } = usePortfolio(); // Use the portfolio context
  const [calculatedAssetData, setCalculatedAssetData] = useState<AssetData[]>([]);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    if (!loading && allTrades) {
      const holdings: { [key: string]: { amount: number; cost: number } } = {};

      allTrades.forEach(trade => {
        const amount = parseFloat(trade.amount);
        const price = parseFloat(trade.price);

        if (!isNaN(amount) && !isNaN(price)) {
          if (!holdings[trade.symbol]) {
            holdings[trade.symbol] = { amount: 0, cost: 0 };
          }

          if (trade.type === 'buy') {
            holdings[trade.symbol].amount += amount;
            holdings[trade.symbol].cost += amount * price;
          } else if (trade.type === 'sell') {
            holdings[trade.symbol].amount -= amount;
            holdings[trade.symbol].cost -= amount * price; // Subtract cost for sells
          }
        }
      });

      let currentTotalValue = 0;
      const newAssetData: AssetData[] = [];
      let colorIndex = 0;

      for (const symbol in holdings) {
        if (holdings[symbol].amount > 0) { // Only include positive holdings
          const totalCost = holdings[symbol].cost;
          currentTotalValue += totalCost;
          newAssetData.push({
            name: `${symbol}`,
            value: totalCost,
            percentage: 0,
            color: chartColors[colorIndex % chartColors.length],
          });
          colorIndex++;
        }
      }

      // Calculate percentages
      const finalAssetData = newAssetData.map(asset => ({
        ...asset,
        percentage: currentTotalValue > 0 ? (asset.value / currentTotalValue) * 100 : 0,
      }));

      setCalculatedAssetData(finalAssetData);
      setTotalValue(currentTotalValue);
    }
  }, [allTrades, loading]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-card-foreground font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data.value)} ({data.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
    const percentage = percent * 100;
    if (percentage < 5) return null // Don't display for less than 5%

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${percentage.toFixed(1)}%`}
      </text>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Asset Allocation</CardTitle>
        <CardDescription>Composition ratio of your portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={calculatedAssetData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {calculatedAssetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Asset List */}
          <div className="space-y-4">
            <div className="text-lg font-semibold text-card-foreground mb-4">Total Assets: {formatCurrency(totalValue)}</div>
            {calculatedAssetData.map((asset, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: asset.color }} />
                  <div>
                    <div className="font-medium text-card-foreground">{asset.name}</div>
                    <div className="text-sm text-muted-foreground">{asset.percentage}%</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-card-foreground">{formatCurrency(asset.value)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
