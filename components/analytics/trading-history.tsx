"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Filter } from "lucide-react"

interface Trade {
  id: string
  date: string
  symbol: string
  type: "buy" | "sell"
  amount: number
  price: number
  total: number
  pnl?: number
  pnlPercent?: number
}

export function TradingHistory() {
  const [filterType, setFilterType] = useState("all")
  const [timeRange, setTimeRange] = useState("1M")

  // モック取引データ
  const trades: Trade[] = [
    {
      id: "1",
      date: "2024-01-30",
      symbol: "BTC",
      type: "sell",
      amount: 0.5,
      price: 46200,
      total: 23100,
      pnl: 2100,
      pnlPercent: 10.0,
    },
    {
      id: "2",
      date: "2024-01-25",
      symbol: "ETH",
      type: "buy",
      amount: 8,
      price: 2900,
      total: 23200,
    },
    {
      id: "3",
      date: "2024-01-20",
      symbol: "BTC",
      type: "buy",
      amount: 0.5,
      price: 43800,
      total: 21900,
    },
    {
      id: "4",
      date: "2024-01-15",
      symbol: "ADA",
      type: "sell",
      amount: 5000,
      price: 0.52,
      total: 2600,
      pnl: 400,
      pnlPercent: 18.2,
    },
    {
      id: "5",
      date: "2024-01-10",
      symbol: "SOL",
      type: "buy",
      amount: 50,
      price: 98,
      total: 4900,
    },
  ]

  // 月別取引量データ
  const monthlyData = [
    { month: "10月", volume: 45000, trades: 12, profit: 2400 },
    { month: "11月", volume: 52000, trades: 15, profit: 3200 },
    { month: "12月", volume: 38000, trades: 8, profit: -800 },
    { month: "1月", volume: 67000, trades: 18, profit: 4500 },
  ]

  const filteredTrades = trades.filter((trade) => {
    if (filterType === "all") return true
    return trade.type === filterType
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
    })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-card-foreground font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === "取引数" ? entry.value : formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* 月別取引統計 */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">月別取引統計</CardTitle>
          <CardDescription>取引量と損益の推移</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="volume" fill="hsl(var(--primary))" name="取引量" />
                <Bar dataKey="profit" fill="hsl(var(--chart-1))" name="損益" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 取引履歴 */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground">取引履歴</CardTitle>
              <CardDescription>最近の取引記録</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-24 bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="buy">買い</SelectItem>
                  <SelectItem value="sell">売り</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                フィルター
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTrades.map((trade) => (
              <div
                key={trade.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${trade.type === "buy" ? "bg-chart-1/10" : "bg-chart-3/10"}`}>
                    {trade.type === "buy" ? (
                      <TrendingUp className="h-4 w-4 text-chart-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-chart-3" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-card-foreground">
                      {trade.symbol} - {trade.type === "buy" ? "買い" : "売り"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {trade.amount} × {formatCurrency(trade.price)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-medium text-card-foreground">{formatCurrency(trade.total)}</div>
                  {trade.pnl !== undefined && (
                    <div className={`text-sm ${trade.pnl >= 0 ? "text-chart-1" : "text-chart-3"}`}>
                      {trade.pnl >= 0 ? "+" : ""}
                      {formatCurrency(trade.pnl)} ({trade.pnlPercent?.toFixed(1)}%)
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">{formatDate(trade.date)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
