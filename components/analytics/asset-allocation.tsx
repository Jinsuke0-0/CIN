"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface AssetData {
  name: string
  value: number
  percentage: number
  color: string
}

export function AssetAllocation() {
  const assetData: AssetData[] = [
    { name: "Bitcoin (BTC)", value: 45000, percentage: 38.1, color: "hsl(var(--chart-2))" },
    { name: "Ethereum (ETH)", value: 32000, percentage: 27.1, color: "hsl(var(--chart-4))" },
    { name: "Binance Coin (BNB)", value: 18000, percentage: 15.3, color: "hsl(var(--chart-1))" },
    { name: "Cardano (ADA)", value: 12000, percentage: 10.2, color: "hsl(var(--chart-5))" },
    { name: "Solana (SOL)", value: 8000, percentage: 6.8, color: "hsl(var(--chart-3))" },
    { name: "Other", value: 3000, percentage: 2.5, color: "hsl(var(--muted))" },
  ]

  const totalValue = assetData.reduce((sum, asset) => sum + asset.value, 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload }: any) => {
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

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
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
                  data={assetData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetData.map((entry, index) => (
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
            {assetData.map((asset, index) => (
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