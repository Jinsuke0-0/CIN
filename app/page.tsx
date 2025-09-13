"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Wallet, FileText, BarChart3, Users, Shield } from "lucide-react"
import { WalletConnect } from "@/components/auth/wallet-connect"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
// user upsert is now handled via API route to avoid client-side supabase usage

export default function HomePage() {
  const [account, setAccount] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress")
    if (storedAddress) {
      setAccount(storedAddress)
      // If already authenticated, redirect to dashboard automatically
      try {
        // Use replace to avoid stacking history
        router.replace("/dashboard")
      } catch (e) {
        console.warn("router.replace failed, fallback to location.assign", e)
        if (typeof window !== "undefined") {
          window.location.assign("/dashboard")
        }
      }
    }
  }, [router])

  const handleConnect = async (address: string) => {
    setAccount(address)
    localStorage.setItem("walletAddress", address)
    setIsDialogOpen(false)
    
    // Persist user via server API; always navigate to dashboard even if this fails
    console.log("Address received in handleConnect:", address)
    void fetch("/api/auth/wallet-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress: address }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "")
          console.error("wallet-login API failed:", res.status, text)
        }
      })
      .catch((e) => {
        console.error("wallet-login API error:", e)
      })

    try {
      router.push("/dashboard")
      // Fallback in case client-side routing is blocked by modal/transition
      setTimeout(() => {
        if (typeof window !== "undefined" && window.location.pathname !== "/dashboard") {
          router.replace("/dashboard")
          setTimeout(() => {
            if (window.location.pathname !== "/dashboard") {
              window.location.assign("/dashboard")
            }
          }, 150)
        }
      }, 50)
    } catch (e) {
      console.warn("router.push failed, forcing navigation:", e)
      if (typeof window !== "undefined") {
        window.location.assign("/dashboard")
      }
    }
  }

  const handleDisconnect = () => {
    setAccount(null)
    localStorage.removeItem("walletAddress")
  }

  return (
    <div className="min-h-screen bg-background">

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
                <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
                <Button asChild variant="ghost">
                  <a href="/dashboard" className="underline text-muted-foreground">If it does not transition</a>
                </Button>
                <Button variant="outline" onClick={handleDisconnect}>Disconnect</Button>
              </div>
            ) : (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Wallet className="mr-2 h-5 w-5" />
                    Connect Wallet
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
            Manage/Share Your Crypto Investments
            <span className="text-primary"> Smartly</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Crypto Investment Note (CIN) is a
            <br />
            crypto portfolio management/sharing platform for crypto investors.
            <br />
            The CIN Token forms the Crypto Investment Note ecosystem.
          </p>
        </section>

        {/* Features Card */}
        <section className="py-12">
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">Main Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-card-foreground">Investment Notes</CardTitle>
                <CardDescription>Record trading strategies and market analysis to systematize investment decisions.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <Wallet className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-card-foreground">Wallet Integration</CardTitle>
                <CardDescription>Automatically retrieve and analyze transaction history by linking with MetaMask.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-card-foreground">Performance Analysis</CardTitle>
                <CardDescription>Visualize investment results with real-time charts.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-card-foreground">Share Notes</CardTitle>
                <CardDescription>Share knowledge with the community by publishing and selling investment notes.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-card-foreground">Security</CardTitle>
                <CardDescription>Secure authentication and data protection with Web3 technology.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-card-foreground">CIN Token</CardTitle>
                <CardDescription>Incentives and governance within the platform.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 text-center">
          <Card className="bg-card border-border max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-card-foreground">Want to manage your crypto investments rationally?</CardTitle>
              <CardDescription className="text-lg">Take your crypto investing to the next level with CIN.</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Get Started with MetaMask
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