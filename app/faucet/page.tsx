"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Wallet } from "lucide-react" // Added back lucide-react import
import Link from "next/link" // Added Link import

export default function FaucetPage() {
  const [isMinting, setIsMinting] = useState(false)
  const [mintSuccess, setMintSuccess] = useState<string | null>(null)
  const [mintError, setMintError] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const getAddress = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setWalletAddress(address);
        } catch (error) {
          console.error("Failed to get wallet address:", error);
        }
      }
    };
    getAddress();
  }, []);

  const handleFaucet = async () => {
    setIsMinting(true)
    setMintSuccess(null)
    setMintError(null)
    try {
      if (!walletAddress) {
        throw new Error("ウォレットが接続されていません。");
      }

      const response = await fetch('/api/mint-cin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userAddress: walletAddress }),
      });

      const data = await response.json();

      if (response.ok) {
        setMintSuccess(data.message || "CINトークンが正常に配布されました！");
      } else {
        throw new Error(data.error || "トークンの配布に失敗しました。");
      }
    } catch (err: any) {
      setMintError(err.message || "トークンの配布中にエラーが発生しました。");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md bg-card border-0 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-card-foreground">CIN Faucet</CardTitle>
          <CardDescription>テスト用のCINトークンを取得できます。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {walletAddress ? (
            <p className="text-center text-sm text-muted-foreground">接続中のウォレット: {walletAddress}</p>
          ) : (
            <p className="text-center text-sm text-red-500">ウォレットが接続されていません。MetaMaskを接続してください。</p>
          )}

          {mintSuccess && (
            <div className="bg-green-100 border border-green-200 text-green-700 text-sm rounded-lg p-3 flex items-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              <p>{mintSuccess}</p>
            </div>
          )}

          {mintError && (
            <div className="bg-red-100 border border-red-200 text-red-700 text-sm rounded-lg p-3 flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              <p>{mintError}</p>
            </div>
          )}

          <Button
            onClick={handleFaucet}
            disabled={isMinting || !walletAddress}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            <Wallet className="mr-2 h-5 w-5" />
            {isMinting ? "トークン取得中..." : "30 CINトークンを取得"}
          </Button>
          <Link href="/dashboard" passHref>
            <Button variant="outline" className="w-full mt-2">
              Dashboardに戻る
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
