"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, MessageCircle, Share2, DollarSign, Search, TrendingUp, User, Star } from "lucide-react"

interface PublicNote {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  author: {
    id: string
    name: string
    avatar: string
    verified: boolean
    followers: number
  }
  price: number // 0 = 無料
  views: number
  likes: number
  comments: number
  createdAt: string
  isPurchased?: boolean
}

export function NoteFeed() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("trending")
  const [priceFilter, setPriceFilter] = useState("all")

  // モックデータ
  const [notes] = useState<PublicNote[]>([
    {
      id: "1",
      title: "BTC年末予想 - テクニカル分析による価格予測",
      content:
        "ビットコインの年末価格予想をテクニカル分析の観点から詳細に解説します。フィボナッチリトレースメント、移動平均線、RSIなどの指標を用いて...",
      category: "技術分析",
      tags: ["BTC", "価格予想", "テクニカル分析"],
      author: {
        id: "user1",
        name: "CryptoAnalyst",
        avatar: "/crypto-analyst.png",
        verified: true,
        followers: 1250,
      },
      price: 500, // CINトークン
      views: 2340,
      likes: 156,
      comments: 23,
      createdAt: "2024-01-15T10:00:00Z",
      isPurchased: false,
    },
    {
      id: "2",
      title: "DeFi利回り農業の最新戦略",
      content: "2024年最新のDeFi利回り農業戦略を公開。リスクを最小化しながら高利回りを狙う手法について...",
      category: "DeFi",
      tags: ["DeFi", "利回り農業", "戦略"],
      author: {
        id: "user2",
        name: "DeFiMaster",
        avatar: "/defi-master.png",
        verified: true,
        followers: 890,
      },
      price: 0, // 無料
      views: 1890,
      likes: 234,
      comments: 45,
      createdAt: "2024-01-14T14:30:00Z",
    },
    {
      id: "3",
      title: "アルトコイン投資ポートフォリオ戦略",
      content: "リスク分散を考慮したアルトコイン投資ポートフォリオの構築方法について詳しく解説...",
      category: "ポートフォリオ管理",
      tags: ["アルトコイン", "ポートフォリオ", "リスク管理"],
      author: {
        id: "user3",
        name: "PortfolioGuru",
        avatar: "/portfolio-guru.png",
        verified: false,
        followers: 456,
      },
      price: 300,
      views: 1234,
      likes: 89,
      comments: 12,
      createdAt: "2024-01-13T09:15:00Z",
      isPurchased: true,
    },
  ])

  const categories = [
    "all",
    "技術分析",
    "ファンダメンタル分析",
    "取引戦略",
    "市場動向",
    "ポートフォリオ管理",
    "リスク管理",
    "DeFi",
    "NFT",
  ]

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "free" && note.price === 0) ||
      (priceFilter === "paid" && note.price > 0)
    return matchesSearch && matchesCategory && matchesPrice
  })

  const handleLike = (noteId: string) => {
    console.log("Like note:", noteId)
  }

  const handleComment = (noteId: string) => {
    console.log("Comment on note:", noteId)
  }

  const handleShare = (noteId: string) => {
    console.log("Share note:", noteId)
  }

  const handlePurchase = (noteId: string, price: number) => {
    console.log("Purchase note:", noteId, "for", price, "CIN tokens")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">コミュニティフィード</h1>
        <p className="text-muted-foreground">投資家の知見とノートを発見</p>
      </div>

      {/* フィルター・検索 */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ノートを検索..."
                className="pl-10 bg-input border-border"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="カテゴリ" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "すべて" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="価格" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="free">無料</SelectItem>
                <SelectItem value="paid">有料</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="並び順" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">トレンド</SelectItem>
                <SelectItem value="latest">最新</SelectItem>
                <SelectItem value="popular">人気</SelectItem>
                <SelectItem value="price">価格順</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              {filteredNotes.length} 件
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ノートフィード */}
      <div className="space-y-4">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={note.author.avatar || "/placeholder.svg"} alt={note.author.name} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-card-foreground">{note.author.name}</span>
                      {note.author.verified && <Star className="h-4 w-4 text-primary fill-primary" />}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {note.author.followers.toLocaleString()} フォロワー • {formatDate(note.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{note.category}</Badge>
                  {note.price > 0 ? (
                    <Badge variant="outline" className="text-primary border-primary">
                      {note.price} CIN
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-chart-1 border-chart-1">
                      無料
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-card-foreground mb-2 hover:text-primary cursor-pointer">
                {note.title}
              </CardTitle>
              <CardDescription className="mb-4 line-clamp-3">
                {note.price > 0 && !note.isPurchased
                  ? `${note.content.substring(0, 100)}... [続きを読むには購入が必要です]`
                  : note.content}
              </CardDescription>

              <div className="flex flex-wrap gap-1 mb-4">
                {note.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(note.id)}
                    className="text-muted-foreground hover:text-chart-3"
                  >
                    <Heart className="mr-1 h-4 w-4" />
                    {note.likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleComment(note.id)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <MessageCircle className="mr-1 h-4 w-4" />
                    {note.comments}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(note.id)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Share2 className="mr-1 h-4 w-4" />
                    シェア
                  </Button>
                  <span className="text-sm text-muted-foreground">{note.views.toLocaleString()} 閲覧</span>
                </div>

                {note.price > 0 && !note.isPurchased && (
                  <Button
                    onClick={() => handlePurchase(note.id, note.price)}
                    className="bg-primary hover:bg-primary/90"
                    size="sm"
                  >
                    <DollarSign className="mr-1 h-4 w-4" />
                    {note.price} CINで購入
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-card-foreground mb-2">ノートが見つかりません</h3>
            <p className="text-muted-foreground">検索条件を変更してみてください</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
