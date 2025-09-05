"use client"

import { Sidebar } from "@/components/dashboard/sidebar"

import { AssetAllocation } from "@/components/analytics/asset-allocation"
import { PerformanceMetrics } from "@/components/analytics/performance-metrics"
import { PortfolioProvider } from "@/contexts/PortfolioContext"

export default function AnalyticsPage() {
  return (
    <PortfolioProvider>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 bg-sidebar border-r border-sidebar-border overflow-y-auto">
            <Sidebar />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <main className="h-full overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-2xl font-bold text-foreground">Performance Analysis</h1>
                <p className="text-muted-foreground">Detailed analysis and reports of your investment performance</p>
              </div>

              {/* Performance Metrics */}
              <PerformanceMetrics />

              

              {/* Asset Allocation */}
              <AssetAllocation />

            </div>
          </main>
        </div>
      </div>
    </PortfolioProvider>
  )
}
