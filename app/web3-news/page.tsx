"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function Web3NewsPage() {
  const newsSites = [
    {
      name: "CoinDesk",
      url: "https://www.coindesk.com/",
      description: "Leading source for news and information on cryptocurrency, blockchain, and digital assets.",
    },
    {
      name: "CoinTelegraph",
      url: "https://cointelegraph.com/",
      description: "Independent publishing organization focused on cryptocurrencies, blockchain, and the decentralized web.",
    },
    {
      name: "The Block",
      url: "https://www.theblockcrypto.com/",
      description: "Research-driven news and insights on the digital asset space.",
    },
    {
      name: "Decrypt",
      url: "https://decrypt.co/",
      description: "Breaking news and in-depth analysis on Bitcoin, Ethereum, and the decentralized web.",
    },
    {
      name: "Blockworks",
      url: "https://blockworks.co/",
      description: "Financial news and insights for crypto and blockchain professionals.",
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
                <CardTitle className="text-4xl font-extrabold tracking-tight lg:text-5xl">Web3 News</CardTitle>
                <CardDescription className="text-lg text-gray-400">Stay updated with the latest in Web3, crypto, and blockchain.</CardDescription>
              </CardHeader>
            </Card>
            <Separator className="bg-gray-700" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {newsSites.map((site) => (
                <Link href={site.url} key={site.name} target="_blank" rel="noopener noreferrer">
                  <Card className="flex flex-col bg-neutral-900 text-gray-100 border border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-xl h-full">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-xl font-semibold text-white">{site.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow p-4 pt-0">
                      <p className="text-gray-400 line-clamp-3 text-sm">{site.description}</p>
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
