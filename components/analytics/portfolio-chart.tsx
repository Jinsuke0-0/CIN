"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"

interface PortfolioData {
  date: string
  portfolioValue: number
  btcPrice: number
  ethPrice: number
  totalInvested: number
}

export function PortfolioChart() {
  const [timeRange, setTimeRange] = useState("1M")
  const [comparison, setComparison] = useState("BTC")

  // Mock data
  const portfolioData: PortfolioData[] = [
    { date: "2024-01-01", portfolioValue: 100000, btcPrice: 42000, ethPrice: 2500, totalInvested: 95000 },
    { date: "2024-01-05", portfolioValue: 105000, btcPrice: 43500, ethPrice: 2600, totalInvested: 95000 },
    { date: "2024-01-10", portfolioValue: 98000, btcPrice: 41000, ethPrice: 2400, totalInvested: 95000 },
    { date: "2024-01-15", portfolioValue: 112000, btcPrice: 45000, ethPrice: 2750, totalInvested: 95000 },
    { date: "2024-01-20", portfolioValue: 108000, btcPrice: 43800, ethPrice: 2650, totalInvested: 95000 },
    { date: "2024-01-25", portfolioValue: 125000, btcPrice: 48000, ethPrice: 2900, totalInvested: 95000 },
    { date: "2024-01-30", portfolioValue: 118000, btcPrice: 46200, ethPrice: 2800, totalInvested: 95000 },
  ]

  const currentValue = portfolioData[portfolioData.length - 1]?.portfolioValue || 0
  const initialValue = portfolioData[0]?.totalInvested || 0
  const totalGain = currentValue - initialValue
  const totalGainPercent = ((totalGain / initialValue) * 100).toFixed(2)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-card-foreground font-medium">{formatDate(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-card-foreground">Portfolio Performance</CardTitle>
            <CardDescription>Trends and comparative analysis of investment results</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={comparison} onValueChange={setComparison}>
              <SelectTrigger className="w-24 bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC">vs BTC</SelectItem>
                <SelectItem value="ETH">vs ETH</SelectItem>
                <SelectItem value="none">No Comparison</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-20 bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1W">1 Week</SelectItem>
                <SelectItem value="1M">1 Month</SelectItem>
                <SelectItem value="3M">3 Months</SelectItem>
                <SelectItem value="1Y">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-card-foreground">{formatCurrency(currentValue)}</div>
            <div className="text-sm text-muted-foreground">Current Value</div>
          </div>
          <div className="text-center">
            <div
              className={`text-2xl font-bold flex items-center justify-center gap-1 ${
                totalGain >= 0 ? "text-chart-1" : "text-chart-3"
              }`}
            >
              {totalGain >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              {formatCurrency(Math.abs(totalGain))}
            </div>
            <div className="text-sm text-muted-foreground">Total P&L</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${totalGain >= 0 ? "text-chart-1" : "text-chart-3"}`}>
              {totalGain >= 0 ? "+" : ""}
              {totalGainPercent}%
            </div>
            <div className="text-sm text-muted-foreground">Return</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={portfolioData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tickFormatter={formatDate} stroke="hsl(var(--muted-foreground))" />
              <YAxis
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="portfolioValue"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                name="Portfolio"
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              />
              {comparison === "BTC" && (
                <Line
                  type="monotone"
                  dataKey="btcPrice"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  name="BTC Price"
                  dot={false}
                />
              )}
              {comparison === "ETH" && (
                <Line
                  type="monotone"
                  dataKey="ethPrice"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={2}
                  name="ETH Price"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}