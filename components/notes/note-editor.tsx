"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Tag, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { type Note, type Trade } from "@/lib/initial-data"

interface NoteEditorProps {
  note?: Partial<Note>
  onSave: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>) => void
  onCancel: () => void
}

export function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "")
  const [content, setContent] = useState(note?.content || "")
  const [category, setCategory] = useState(note?.category || "")
  const [tags, setTags] = useState<string[]>(note?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [is_public, setIsPublic] = useState(note?.is_public || false)
  const [trades, setTrades] = useState<Trade[]>(note?.trades || [])

  const categories = [
    "Technical Analysis",
    "Fundamental Analysis",
    "Trading Strategy",
    "Market Trends",
    "Portfolio Management",
    "Risk Management",
    "DeFi",
    "NFT",
    "Other",
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
    const newTrade: Trade = {
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
    if (is_public && content.trim() === '') {
      alert('Note Content is required for public notes.');
      return;
    }

    const noteData = {
      title,
      content,
      category,
      tags,
      is_public,
      trades,
    }
    onSave(noteData)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{note?.id ? "Edit Note" : "Create New Note"}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-card-foreground mb-2 block">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter investment note title..."
              className="bg-input border-border"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-card-foreground mb-2 block">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select a category" />
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
              <label className="text-sm font-medium text-card-foreground mb-2 block">Visibility</label>
              <Select
                value={is_public ? "public" : "private"}
                onValueChange={(value) => setIsPublic(value === "public")}
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-card-foreground mb-2 block">Tags</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                className="bg-input border-border"
                onKeyPress={(e) => e.key === "Enter" && addTag()}
              />
              <Button onClick={addTag} variant="outline">
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Note Content */}
      {is_public && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Note Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Record your investment analysis, strategies, market observations, etc..."
              className="min-h-[300px] bg-input border-border resize-none"
            />
          </CardContent>
        </Card>
      )}

      {/* Trade Log */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-card-foreground">Trade Log</CardTitle>
          <Button onClick={addTrade} variant="outline" size="sm">
            <DollarSign className="mr-2 h-4 w-4" />
            Add Trade
          </Button>
        </CardHeader>
        <CardContent>
          {trades.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No trade records yet</p>
          ) : (
            <div className="space-y-4">
              {trades.map((trade) => (
                <div key={trade.id} className="p-4 border border-border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground">Symbol</label>
                      <Input
                        value={trade.symbol}
                        onChange={(e) => updateTrade(trade.id, "symbol", e.target.value)}
                        placeholder="BTC"
                        className="bg-input border-border"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Type</label>
                      <Select value={trade.type} onValueChange={(value) => updateTrade(trade.id, "type", value)}>
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buy">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-chart-1" />
                              Buy
                            </div>
                          </SelectItem>
                          <SelectItem value="sell">
                            <div className="flex items-center gap-2">
                              <TrendingDown className="h-4 w-4 text-chart-3" />
                              Sell
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Amount</label>
                      <Input
                        value={trade.amount}
                        onChange={(e) => updateTrade(trade.id, "amount", e.target.value)}
                        placeholder="0.1"
                        className="bg-input border-border"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Price</label>
                      <Input
                        value={trade.price}
                        onChange={(e) => updateTrade(trade.id, "price", e.target.value)}
                        placeholder="42000"
                        className="bg-input border-border"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Date</label>
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
                      placeholder="Trade notes..."
                      className="bg-input border-border flex-1 mr-2"
                    />
                    <Button variant="destructive" size="sm" onClick={() => removeTrade(trade.id)}>
                      Delete
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
