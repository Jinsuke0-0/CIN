"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePortfolio } from "@/contexts/PortfolioContext"
import { DollarSign, Activity, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// Helper to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function PerformanceMetrics() {
  const { metrics, loading } = usePortfolio();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const displayMetrics = [
    {
      title: "Total Trade Volume",
      value: formatCurrency(metrics.totalTradeVolume),
      description: "Sum of (Amount * Price) for all trades",
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Trades",
      value: metrics.totalTrades,
      description: "Total number of buy/sell records",
      icon: Activity,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {displayMetrics.map((metric) => (
        <Card key={metric.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">{metric.title}</CardTitle>
            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
            <CardDescription className="text-xs">{metric.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}