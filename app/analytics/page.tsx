"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { PortfolioChart } from "@/components/analytics/portfolio-chart"
import { AssetAllocation } from "@/components/analytics/asset-allocation"
import { PerformanceMetrics } from "@/components/analytics/performance-metrics"
import { TradingHistory } from "@/components/analytics/trading-history"

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-background">
      {/* サイドバー */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-sidebar border-r border-sidebar-border overflow-y-auto">
          <Sidebar />
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto p-6">
          <div className="space-y-6">
            {/* ヘッダー */}
            <div>
              <h1 className="text-2xl font-bold text-foreground">パフォーマンス分析</h1>
              <p className="text-muted-foreground">投資成果の詳細分析とレポート</p>
            </div>

            {/* パフォーマンス指標 */}
            <PerformanceMetrics />

            {/* ポートフォリオチャート */}
            <PortfolioChart />

            {/* 資産配分 */}
            <AssetAllocation />

            {/* 取引履歴 */}
            <TradingHistory />
          </div>
        </main>
      </div>
    </div>
  )
}
