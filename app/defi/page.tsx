"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function DefiPage() {
  const defiProtocols = [
    {
      name: "Uniswap",
      url: "https://app.uniswap.org/swap",
      description: "A premier decentralized exchange (DEX) for swapping a wide variety of tokens on the Base network.",
    },
    {
      name: "Aerodrome Finance",
      url: "https://aerodrome.finance/",
      description: "The leading ve(3,3) DEX on the Base ecosystem, offering token swaps and liquidity provision.",
    },
    {
      name: "Compound",
      url: "https://compound.finance/",
      description: "A major lending protocol enabling users to borrow and lend crypto assets on the Base network.",
    },
    {
      name: "Aave",
      url: "https://aave.com/",
      description: "A top-tier lending platform for borrowing and lending a diverse range of cryptocurrencies.",
    },
    {
      name: "Curve",
      url: "https://curve.fi/",
      description: "A specialized DEX for efficient stablecoin swaps and liquidity provision on the Base network.",
    },
    {
      name: "Friend.tech",
      url: "https://www.friend.tech/",
      description: "A popular Web3 social application on the Base network, tokenizing social influence.",
    },
  ]

  return (
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
          <div className="space-y-8">
            <Card className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-4xl font-extrabold tracking-tight lg:text-5xl">Base DeFi Protocols</CardTitle>
                <CardDescription className="text-lg text-gray-400">Explore popular DeFi protocols on the Base network.</CardDescription>
              </CardHeader>
            </Card>
            <Separator className="bg-gray-700" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {defiProtocols.map((protocol) => (
                <Link href={protocol.url} key={protocol.name} target="_blank" rel="noopener noreferrer">
                  <Card className="flex flex-col bg-neutral-900 text-gray-100 border border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-xl h-full">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-xl font-semibold text-white">{protocol.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow p-4 pt-0">
                      <p className="text-gray-400 line-clamp-3 text-sm">{protocol.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
