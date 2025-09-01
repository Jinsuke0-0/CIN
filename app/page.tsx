"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Wallet, FileText, BarChart3, Users, Shield } from "lucide-react"
import { WalletConnect } from "@/components/auth/wallet-connect"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export default function HomePage() {
  const [account, setAccount] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress")
    if (storedAddress) {
      setAccount(storedAddress)
    }
  }, [])

  const handleConnect = (address: string) => {
    setAccount(address)
    localStorage.setItem("walletAddress", address)
    setIsDialogOpen(false)
    router.push("/dashboard")
  }

  const handleDisconnect = () => {
    setAccount(null)
    localStorage.removeItem("walletAddress")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Crypto Investment Note</h1>
            </div>
            {account ? (
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                </div>
                <Button variant="outline" onClick={handleDisconnect}>切断</Button>
              </div>
            ) : (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Wallet className="mr-2 h-5 w-5" />
                    ウォレット接続
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <WalletConnect onConnect={handleConnect} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        {/* ヒーローセクション */}
        <section className="text-center py-12">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
            暗号資産投資を
            <span className="text-primary">スマートに管理/共有</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Crypto Investment Note（CIN）は、暗号資産投資家向けの
            <br />
            Cryptoポートフォリオ管理/共有プラットフォームです。
            <br />
            投資ノートの作成、取引記録、情報共有、
            <br />
            独自TokenであるCIN TokenはCrypto Investment Note経済圏を形成しています。
          </p>
        </section>

        {/* 機能カード */}
        <section className="py-12">
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">主な機能</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-card-foreground">投資ノート</CardTitle>
                <CardDescription>取引戦略や市場分析を記録し、投資判断を体系化</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <Wallet className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-card-foreground">ウォレット連携</CardTitle>
                <CardDescription>MetaMaskと連携して取引履歴を自動取得・分析</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-card-foreground">パフォーマンス分析</CardTitle>
                <CardDescription>リアルタイムチャートで投資成果を可視化</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-card-foreground">ノート共有</CardTitle>
                <CardDescription>投資ノートを公開・販売してコミュニティと知見を共有</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-card-foreground">セキュリティ</CardTitle>
                <CardDescription>Web3技術による安全な認証とデータ保護</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-card-foreground">CINトークン</CardTitle>
                <CardDescription>プラットフォーム内でのインセンティブとガバナンス</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA セクション */}
        <section className="py-12 text-center">
          <Card className="bg-card border-border max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-card-foreground">暗号資産投資を合理的に管理しませんか？</CardTitle>
              <CardDescription className="text-lg">CINで暗号資産投資を次のレベルへ</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    MetaMaskで始める
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <WalletConnect onConnect={handleConnect} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* フッター */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 Crypto Investment Note (CIN). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
