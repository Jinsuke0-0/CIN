"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageCircle, Share2, User, Star, ArrowLeft, Send } from "lucide-react"

interface Comment {
  id: string
  author: {
    name: string
    avatar: string
    verified: boolean
  }
  content: string
  createdAt: string
  likes: number
}

interface NoteDetailProps {
  noteId: string
  onBack: () => void
}

export function NoteDetail({ noteId, onBack }: NoteDetailProps) {
  const [newComment, setNewComment] = useState("")
  const [isLiked, setIsLiked] = useState(false)

  // モックデータ
  const note = {
    id: noteId,
    title: "BTC年末予想 - テクニカル分析による価格予測",
    content: `# ビットコイン年末価格予想

## 概要
ビットコインの年末価格予想をテクニカル分析の観点から詳細に解説します。

## 主要な分析指標

### 1. フィボナッチリトレースメント
現在の価格レベルは61.8%のリトレースメントレベル付近で推移しており、これは重要なサポートレベルとなっています。

### 2. 移動平均線分析
- 20日移動平均線: $41,500
- 50日移動平均線: $39,800
- 200日移動平均線: $35,200

### 3. RSI分析
現在のRSIは45付近で推移しており、売られすぎの状態から回復しつつあります。

## 価格予想
上記の分析を総合すると、年末までに$50,000-$55,000のレンジでの推移を予想します。

## リスク要因
- マクロ経済環境の変化
- 規制動向
- 機関投資家の動向

## まとめ
テクニカル分析の観点から、ビットコインは年末に向けて上昇トレンドを継続する可能性が高いと考えています。`,
    category: "技術分析",
    tags: ["BTC", "価格予想", "テクニカル分析"],
    author: {
      id: "user1",
      name: "CryptoAnalyst",
      avatar: "/crypto-analyst.png",
      verified: true,
      followers: 1250,
      bio: "10年以上の投資経験を持つテクニカルアナリスト。主要取引所でのトレーディング経験あり。",
    },
    price: 500,
    views: 2340,
    likes: 156,
    comments: 23,
    createdAt: "2024-01-15T10:00:00Z",
    isPurchased: true,
  }

  const [comments] = useState<Comment[]>([
    {
      id: "1",
      author: {
        name: "TraderJoe",
        avatar: "/diverse-group-traders.png",
        verified: false,
      },
      content: "素晴らしい分析ですね！特にフィボナッチの解説が参考になりました。",
      createdAt: "2024-01-15T12:00:00Z",
      likes: 12,
    },
    {
      id: "2",
      author: {
        name: "CryptoNewbie",
        avatar: "/newbie-sign.png",
        verified: false,
      },
      content: "初心者にも分かりやすい説明でした。RSIについてもっと詳しく知りたいです。",
      createdAt: "2024-01-15T14:30:00Z",
      likes: 8,
    },
  ])

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      console.log("Submit comment:", newComment)
      setNewComment("")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          戻る
        </Button>
      </div>

      {/* ノート詳細 */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={note.author.avatar || "/placeholder.svg"} alt={note.author.name} />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-card-foreground">{note.author.name}</span>
                  {note.author.verified && <Star className="h-4 w-4 text-primary fill-primary" />}
                </div>
                <div className="text-sm text-muted-foreground">{note.author.followers.toLocaleString()} フォロワー</div>
                <div className="text-sm text-muted-foreground mt-1">{note.author.bio}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{note.category}</Badge>
              <Badge variant="outline" className="text-primary border-primary">
                {note.price} CIN
              </Badge>
            </div>
          </div>

          <CardTitle className="text-2xl text-card-foreground">{note.title}</CardTitle>
          <CardDescription>投稿日: {formatDate(note.createdAt)}</CardDescription>

          <div className="flex flex-wrap gap-1 mt-4">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <div className="prose prose-invert max-w-none mb-6">
            <div className="whitespace-pre-wrap text-card-foreground leading-relaxed">{note.content}</div>
          </div>

          <Separator className="my-6" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`${isLiked ? "text-chart-3" : "text-muted-foreground"} hover:text-chart-3`}
              >
                <Heart className={`mr-1 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                {note.likes + (isLiked ? 1 : 0)}
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <MessageCircle className="mr-1 h-4 w-4" />
                {note.comments}
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Share2 className="mr-1 h-4 w-4" />
                シェア
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">{note.views.toLocaleString()} 閲覧</span>
          </div>
        </CardContent>
      </Card>

      {/* コメントセクション */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">コメント ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 新しいコメント */}
          <div className="mb-6">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="コメントを追加..."
              className="mb-2 bg-input border-border resize-none"
              rows={3}
            />
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="mr-2 h-4 w-4" />
              コメント投稿
            </Button>
          </div>

          <Separator className="mb-6" />

          {/* コメント一覧 */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-card-foreground text-sm">{comment.author.name}</span>
                    {comment.author.verified && <Star className="h-3 w-3 text-primary fill-primary" />}
                    <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-card-foreground mb-2">{comment.content}</p>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-chart-3 p-0 h-auto">
                    <Heart className="mr-1 h-3 w-3" />
                    {comment.likes}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
