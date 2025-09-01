"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, TrendingUp, Users, Settings, Wallet, BarChart3, PlusCircle } from "lucide-react"

interface SidebarProps {
  className?: string
}

const navigation = [
  { name: "ダッシュボード", href: "/dashboard", icon: LayoutDashboard },
  { name: "投資ノート", href: "/notes", icon: FileText },
  { name: "ポートフォリオ", href: "/portfolio", icon: TrendingUp },
  { name: "パフォーマンス", href: "/analytics", icon: BarChart3 },
  { name: "コミュニティ", href: "/community", icon: Users },
  { name: "ウォレット", href: "/wallet", icon: Wallet },
]

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">CIN</h2>
          </div>

          <Button className="w-full mb-4 bg-primary hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            新しいノート
          </Button>

          <div className="space-y-1">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="px-3 py-2">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Settings className="mr-2 h-4 w-4" />
              設定
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
