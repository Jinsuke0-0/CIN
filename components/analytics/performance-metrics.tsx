import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Target, Shield, Zap, Calendar } from "lucide-react"

export function PerformanceMetrics() {
  const metrics = [
    {
      title: "Total Return (ROI)",
      value: "+24.21%",
      description: "Total return since inception",
      icon: TrendingUp,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Annualized Return",
      value: "+18.45%",
      description: "Annualized return",
      icon: Calendar,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Sharpe Ratio",
      value: "1.34",
      description: "Risk-adjusted return",
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Max Drawdown",
      value: "-12.8%",
      description: "Maximum decline from peak",
      icon: TrendingDown,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Volatility",
      value: "28.5%",
      description: "Magnitude of price fluctuations",
      icon: Zap,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Win Rate",
      value: "67.3%",
      description: "Percentage of profitable trades",
      icon: Shield,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-card border-border">
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