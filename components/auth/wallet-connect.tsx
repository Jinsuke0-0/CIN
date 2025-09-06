"use client"

import { useState } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DialogTitle } from "@/components/ui/dialog"
import { Wallet, Shield, TrendingUp, AlertTriangle } from "lucide-react"
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider
  }
}

interface WalletConnectProps {
  onConnect: (address: string) => void
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async () => {
    setIsConnecting(true)
    setError(null)
    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMaskがインストールされていません。")
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      
      // ユーザーにアカウントへの接続を要求
      await provider.send("eth_requestAccounts", [])
      
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      
      onConnect(address)

    } catch (err: any) {
      setError(err.message || "ウォレットの接続に失敗しました。")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSwitchAccount = async () => {
    setIsConnecting(true)
    setError(null)
    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMaskがインストールされていません。")
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      
      // ユーザーにアカウントの切り替えを要求
      await provider.send("eth_requestAccounts", [])
      
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      
      onConnect(address)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "アカウントの切り替えに失敗しました。")
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div>
      <VisuallyHidden.Root>
        <DialogTitle>CINへようこそ</DialogTitle>
      </VisuallyHidden.Root>
      <Card className="bg-card border-0">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <TrendingUp className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl text-card-foreground">CINへようこそ</CardTitle>
          <CardDescription>暗号資産投資を始めるために、ウォレットを接続してください</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3 flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full bg-primary hover:bg-primary/90 mb-2"
            size="lg"
          >
            <Wallet className="mr-2 h-5 w-5" />
            {isConnecting ? "接続中..." : "MetaMaskで接続"}
          </Button>
          <Button
            onClick={handleSwitchAccount}
            disabled={isConnecting}
            className="w-full bg-secondary hover:bg-secondary/90"
            size="lg"
          >
            <Wallet className="mr-2 h-5 w-5" />
            アカウントを切り替える
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>安全なWeb3認証</span>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            ウォレットを接続することで、利用規約とプライバシーポリシーに同意したものとみなされます。
          </div>
        </CardContent>
      </Card>
    </div>
  )
}