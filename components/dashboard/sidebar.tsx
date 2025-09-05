"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, Users, PlusCircle, BarChart3, LogOut, FileSearch, Newspaper, Shield, Calendar, Wallet } from "lucide-react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const cinPrivateNav = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Investment Notes", href: "/notes", icon: FileText },
    { name: "Performance", href: "/analytics", icon: BarChart3 },
    { name: "Faucet", href: "/faucet", icon: Wallet },
  ]

  const cinPublicNav = [
    { name: "Open Notes", href: "/opennote", icon: FileSearch },
    { name: "Web3 News", href: "/web3-news", icon: Newspaper },
    { name: "DeFi", href: "/defi", icon: Shield },
    { name: "Official Events", href: "/official-events", icon: Calendar },
  ]

  const handleLogout = () => {
    localStorage.removeItem("walletAddress")
    router.push("/")
  }

  const handleNewNote = () => {
    router.push("/notes?action=create")
  }

  return (
    <div className={cn("h-full flex flex-col", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-6 px-4">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">CIN</h2>
          </div>

          <div className="px-3 py-2">
            <Button className="w-full mb-4 bg-primary hover:bg-primary/90" onClick={handleNewNote}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </div>

          <div className="space-y-1">
            <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Private</h3>
            {cinPrivateNav.map((item) => (
              <Link href={item.href} key={item.name} passHref>
                <Button
                  variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Public</h3>
            {cinPublicNav.map((item) => (
              <Link href={item.href} key={item.name} passHref>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
        <div className="px-3 py-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      <div className="mt-auto px-3 py-4">
      </div>
    </div>
  )
}