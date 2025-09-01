"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Tag, DollarSign, TrendingUp, TrendingDown } from "lucide-react"

interface NoteEditorProps {
  note?: {
    id?: string
    title: string
    content: string
    category: string
    tags: string[]
    isPublic: boolean
  }
  onSave: (note: any) => void
  onCancel: () => void
}

export function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "")
  const [content, setContent] = useState(note?.content || "")
  const [category, setCategory] = useState(note?.category || "")
  const [tags, setTags] = useState<string[]>(note?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [isPublic, setIsPublic] = useState(note?.isPublic || false)
  const [trades, setTrades] = useState<any[]>([])

  const categories = [
    "技術分析",
    "ファンダメンタル分析",
    "取引戦略",
    "市場動向",
    "ポートフォリオ管理",
    "リスク管理",
    "DeFi",
    "NFT",
    "その他",
  ]

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const addTrade = () => {
    const newTrade = {
      id: Date.now(),
      symbol: "",
      type: "buy",
      amount: "",
      price: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    }
    setTrades([...trades, newTrade])
  }

  const updateTrade = (id: number, field: string, value: string) => {
    setTrades(trades.map((trade) => (trade.id === id ? { ...trade, [field]: value } : trade)))
  }

  const removeTrade = (id: number) => {
    setTrades(trades.filter((trade) => trade.id !== id))
  }

  const handleSave = () => {
    const noteData = {
      id: note?.id,
      title,
      content,
      category,
      tags,
      isPublic,
      trades,
      createdAt: note?.id ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    onSave(noteData)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{note?.id ? "ノートを編集" : "新しいノートを作成"}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" />
            保存
          </Button>
        </div>
      </div>

      {/* 基本情報 */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-card-foreground mb-2 block">タイトル</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="投資ノートのタイトルを入力..."
              className="bg-input border-border"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-card-foreground mb-2 block">カテゴリ</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="カテゴリを選択" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-card-foreground mb-2 block">公開設定</label>
              <Select
                value={isPublic ? "public" : "private"}
                onValueChange={(value) => setIsPublic(value === "public")}
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">非公開</SelectItem>
                  <SelectItem value="public">公開</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* タグ */}
          <div>
            <label className="text-sm font-medium text-card-foreground mb-2 block">タグ</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="タグを追加..."
                className="bg-input border-border"
                onKeyPress={(e) => e.key === "Enter" && addTag()}
              />
              <Button onClick={addTag} variant="outline">
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ノート内容 */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">ノート内容</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="投資分析、戦略、市場観察などを記録してください..."
            className="min-h-[300px] bg-input border-border resize-none"
          />
        </CardContent>
      </Card>

      {/* 取引記録 */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-card-foreground">取引記録</CardTitle>
          <Button onClick={addTrade} variant="outline" size="sm">
            <DollarSign className="mr-2 h-4 w-4" />
            取引を追加
          </Button>
        </CardHeader>
        <CardContent>
          {trades.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">取引記録がありません</p>
          ) : (
            <div className="space-y-4">
              {trades.map((trade) => (
                <div key={trade.id} className="p-4 border border-border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground">銘柄</label>
                      <Input
                        value={trade.symbol}
                        onChange={(e) => updateTrade(trade.id, "symbol", e.target.value)}
                        placeholder="BTC"
                        className="bg-input border-border"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">種類</label>
                      <Select value={trade.type} onValueChange={(value) => updateTrade(trade.id, "type", value)}>
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buy">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-chart-1" />
                              買い
                            </div>
                          </SelectItem>
                          <SelectItem value="sell">
                            <div className="flex items-center gap-2">
                              <TrendingDown className="h-4 w-4 text-chart-3" />
                              売り
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">数量</label>
                      <Input
                        value={trade.amount}
                        onChange={(e) => updateTrade(trade.id, "amount", e.target.value)}
                        placeholder="0.1"
                        className="bg-input border-border"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">価格</label>
                      <Input
                        value={trade.price}
                        onChange={(e) => updateTrade(trade.id, "price", e.target.value)}
                        placeholder="42000"
                        className="bg-input border-border"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">日付</label>
                      <Input
                        type="date"
                        value={trade.date}
                        onChange={(e) => updateTrade(trade.id, "date", e.target.value)}
                        className="bg-input border-border"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <Input
                      value={trade.notes}
                      onChange={(e) => updateTrade(trade.id, "notes", e.target.value)}
                      placeholder="取引メモ..."
                      className="bg-input border-border flex-1 mr-2"
                    />
                    <Button variant="destructive" size="sm" onClick={() => removeTrade(trade.id)}>
                      削除
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
