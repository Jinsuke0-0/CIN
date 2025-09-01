import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, Percent } from "lucide-react"

export function PortfolioOverview() {
  const portfolioData = {
    totalValue: 125420.5,
    dailyChange: 2.34,
    dailyChangeAmount: 2890.12,
    totalPnL: 15420.5,
    totalPnLPercent: 14.05,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-card-foreground">総資産価値</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-card-foreground">${portfolioData.totalValue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">前日比 ${portfolioData.dailyChangeAmount.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-card-foreground">日次変動</CardTitle>
          <TrendingUp className="h-4 w-4 text-chart-1" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-1">+{portfolioData.dailyChange}%</div>
          <p className="text-xs text-muted-foreground">過去24時間</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-card-foreground">総損益</CardTitle>
          <TrendingUp className="h-4 w-4 text-chart-1" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-1">+${portfolioData.totalPnL.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">開始以来</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-card-foreground">総利回り</CardTitle>
          <Percent className="h-4 w-4 text-chart-1" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-1">+{portfolioData.totalPnLPercent}%</div>
          <p className="text-xs text-muted-foreground">ROI</p>
        </CardContent>
      </Card>
    </div>
  )
}
