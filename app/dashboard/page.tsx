"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ethers } from "ethers"
import Image from "next/image"
import { Sidebar } from "@/components/dashboard/sidebar"
import { PortfolioOverview } from "@/components/dashboard/portfolio-overview"
import { RecentNotes } from "@/components/dashboard/recent-notes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PortfolioProvider } from "@/contexts/PortfolioContext"
import CINTokenABI from "@/lib/abi/CINToken.json"
import { upsertUser } from "@/lib/user"

interface MarketCoin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
}

const CIN_TOKEN_ADDRESS = "0xD6533D9b1705c01D048D8CcA087F0426d1A09d08"

export default function DashboardPage() {
  const [walletAddress, setWalletAddress] = useState("")
  const [marketData, setMarketData] = useState<MarketCoin[]>([])
  const [loadingMarketData, setLoadingMarketData] = useState(true)
  const [marketError, setMarketError] = useState<string | null>(null)
  const [cinBalance, setCinBalance] = useState<string>("0")
  

  const router = useRouter()

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const { chainId } = await provider.getNetwork()

        if (Number(chainId) !== 84532) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x14A34' }], // Base Sepolia chain ID in hex
            });
          } catch (switchError: unknown) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError instanceof Error && switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: '0x14A34',
                      chainName: 'Base Sepolia',
                      rpcUrls: ['https://sepolia.base.org'],
                      nativeCurrency: {
                        name: 'ETH',
                        symbol: 'ETH',
                        decimals: 18,
                      },
                      blockExplorerUrls: ['https://sepolia-explorer.base.org'],
                    },
                  ],
                });
              } catch (addError) {
                console.error("Failed to add the Base Sepolia network:", addError);
                alert("Failed to add the Base Sepolia network. Please add it manually to MetaMask.");
                return;
              }
            } else {
                alert("Please switch to the Base Sepolia testnet in MetaMask.");
                return;
            }
          }
        }

        // Re-initialize provider and signer after switching chain
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await newProvider.send("eth_requestAccounts", []);
        console.log("Connected wallet address (accounts[0]):", accounts[0]); // Added console.log
        const signer = await newProvider.getSigner();
        setWalletAddress(accounts[0]);
        setSigner(signer);
        localStorage.setItem("walletAddress", accounts[0]);

        // Upsert user in the database
        await upsertUser(accounts[0]);

        const cinTokenContract = new ethers.Contract(CIN_TOKEN_ADDRESS, CINTokenABI.abi, signer);
        setContract(cinTokenContract);
        console.log("CIN Token Contract initialized:", cinTokenContract); // 追加

        const balance = await cinTokenContract.balanceOf(accounts[0]);
        console.log("Raw CIN balance from contract:", balance); // 追加

        const formattedBalance = ethers.formatUnits(balance, 18);
        setCinBalance(formattedBalance);
        console.log("Formatted CIN balance:", formattedBalance); // 追加
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  }, []);

  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress")
    if (storedAddress) {
      setWalletAddress(storedAddress)
      connectWallet()
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
        setMarketError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoadingMarketData(false)
      }
    }

    fetchMarketData()
  }, [connectWallet, router])

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
              <div>
                {!walletAddress ? (
                  <Button onClick={connectWallet}>Connect Wallet</Button>
                ) : (
                  <p className="text-sm text-muted-foreground">Connected</p>
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
                      {loadingMarketData ? (
                        <p>Loading market data...</p>
                      ) : marketError ? (
                        <p className="text-red-500">Error: {marketError}</p>
                      ) : (
                        marketData.map((coin) => (
                          <div key={coin.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Image src={coin.image} alt={coin.name} width={32} height={32} />
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
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{cinBalance}</div>
                      <div className="text-sm text-muted-foreground">CIN Held</div>
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
    </PortfolioProvider>
  )
}
