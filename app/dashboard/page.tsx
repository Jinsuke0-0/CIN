"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { PortfolioOverview } from "@/components/dashboard/portfolio-overview"
import { RecentNotes } from "@/components/dashboard/recent-notes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface MarketCoin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
}

export default function DashboardPage() {
  const [walletAddress, setWalletAddress] = useState("")
  const [marketData, setMarketData] = useState<MarketCoin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress")
    if (storedAddress) {
      setWalletAddress(storedAddress)
    } else {
      router.push("/")
    }

    const fetchMarketData = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        )
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`)
        }
        const data: MarketCoin[] = await response.json()
        setMarketData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchMarketData()
  }, [router])

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-sidebar border-r border-sidebar-border overflow-y-auto">
          <Sidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">Dashboard</h1>
              {walletAddress && (
                <p className="text-sm text-muted-foreground">
                  Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Portfolio Overview */}
            <PortfolioOverview />

            {/* Main Content Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Recent Notes */}
              <RecentNotes />

              {/* Market Overview */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Market Overview</CardTitle>
                  <CardDescription>Top 10 cryptocurrencies by market cap</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <p>Loading market data...</p>
                    ) : error ? (
                      <p className="text-red-500">Error: {error}</p>
                    ) : (
                      marketData.map((coin) => (
                        <div key={coin.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={coin.image} alt={coin.name} className="h-8 w-8" />
                            <div>
                              <div className="font-medium text-card-foreground">{coin.symbol.toUpperCase()}</div>
                              <div className="text-sm text-muted-foreground">{coin.name}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-card-foreground">
                              ${coin.current_price.toLocaleString()}
                            </div>
                            <div
                              className={`text-sm ${coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                              {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                              {coin.price_change_percentage_24h.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CIN Token Info */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">CIN Token</CardTitle>
                <CardDescription>Your CIN token balance and rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">1,250</div>
                    <div className="text-sm text-muted-foreground">CIN Held</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-chart-1">+45</div>
                    <div className="text-sm text-muted-foreground">This Month's Rewards</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-chart-2">$2.50</div>
                    <div className="text-sm text-muted-foreground">CIN Price</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
