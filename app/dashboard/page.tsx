"use client"

import { useState } from "react"
import { WalletConnect } from "@/components/auth/wallet-connect"
import { Sidebar } from "@/components/dashboard/sidebar"
import { PortfolioOverview } from "@/components/dashboard/portfolio-overview"
import { RecentNotes } from "@/components/dashboard/recent-notes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, User, LogOut } from "lucide-react"

export default function DashboardPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address)
    setIsConnected(true)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setWalletAddress("")
  }

  if (!isConnected) {
    return <WalletConnect onConnect={handleWalletConnect} />
  }

  return (
    <div className="flex h-screen bg-background">
      {/* サイドバー */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-sidebar border-r border-sidebar-border overflow-y-auto">
          <Sidebar />
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* ヘッダー */}
        <header className="bg-card border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">ダッシュボード</h1>
              <p className="text-sm text-muted-foreground">
                ウォレット: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDisconnect}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* ダッシュボードコンテンツ */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* ポートフォリオ概要 */}
            <PortfolioOverview />

            {/* メインコンテンツグリッド */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* 最近のノート */}
              <RecentNotes />

              {/* 市場概況 */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">市場概況</CardTitle>
                  <CardDescription>主要暗号資産の価格動向</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { symbol: "BTC", name: "Bitcoin", price: 42150, change: 2.34 },
                      { symbol: "ETH", name: "Ethereum", price: 2580, change: -1.23 },
                      { symbol: "BNB", name: "BNB", price: 315, change: 0.87 },
                    ].map((coin) => (
                      <div key={coin.symbol} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-card-foreground">{coin.symbol}</div>
                          <div className="text-sm text-muted-foreground">{coin.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-card-foreground">${coin.price.toLocaleString()}</div>
                          <div className={`text-sm ${coin.change >= 0 ? "text-chart-1" : "text-chart-3"}`}>
                            {coin.change >= 0 ? "+" : ""}
                            {coin.change}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CINトークン情報 */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">CINトークン</CardTitle>
                <CardDescription>あなたのCINトークン残高と報酬</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">1,250</div>
                    <div className="text-sm text-muted-foreground">保有CIN</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-chart-1">+45</div>
                    <div className="text-sm text-muted-foreground">今月の報酬</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-chart-2">$2.50</div>
                    <div className="text-sm text-muted-foreground">CIN価格</div>
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
