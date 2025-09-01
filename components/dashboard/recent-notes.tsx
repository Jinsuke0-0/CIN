import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Eye, Heart } from "lucide-react"

const recentNotes = [
  {
    id: 1,
    title: "BTC分析 - 2024年Q1戦略",
    description: "ビットコインの技術分析と今四半期の投資戦略について",
    date: "2024-01-15",
    status: "公開",
    views: 234,
    likes: 12,
  },
  {
    id: 2,
    title: "ETH ステーキング戦略",
    description: "イーサリアム2.0ステーキングの最適化手法",
    date: "2024-01-12",
    status: "下書き",
    views: 0,
    likes: 0,
  },
  {
    id: 3,
    title: "DeFiプロトコル比較分析",
    description: "主要DeFiプラットフォームの利回り比較",
    date: "2024-01-10",
    status: "公開",
    views: 456,
    likes: 28,
  },
]

export function RecentNotes() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">最近の投資ノート</CardTitle>
        <CardDescription>あなたの最新の投資分析と戦略</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentNotes.map((note) => (
            <div key={note.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-1" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-card-foreground">{note.title}</h4>
                  <p className="text-xs text-muted-foreground">{note.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={note.status === "公開" ? "default" : "secondary"}>{note.status}</Badge>
                    <span className="text-xs text-muted-foreground">{note.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {note.views}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {note.likes}
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4 bg-transparent">
          すべてのノートを見る
        </Button>
      </CardContent>
    </Card>
  )
}
