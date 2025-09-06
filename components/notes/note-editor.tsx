import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Tag, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { type Note, type Trade } from "@/lib/initial-data"

// Helper to format numbers with commas
const formatNumberWithCommas = (value: string) => {
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return num.toLocaleString('en-US'); // Formats with commas
};

interface NoteEditorProps {
  note?: Partial<Note>
  onSave: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'user_id'>) => void
  onCancel: () => void
}

export function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "")
  const [content, setContent] = useState(note?.content || "")
  const [category, setCategory] = useState(note?.category || "")
  const [tags, setTags] = useState<string[]>(note?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [is_public, setIsPublic] = useState(note?.is_public || false)
  const [pricing, setPricing] = useState(note?.pricing || "free")
  const [price, setPrice] = useState<number | string>(note?.price ?? '')
  const [trades, setTrades] = useState<Trade[]>(note?.trades || [])
  const isContentRequired = is_public
  const isContentMissing = isContentRequired && content.trim() === ''

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
      confirmed: false, // Add this line
    }
    setTrades([...trades, newTrade])
  }

  const updateTrade = (id: number, field: string, value: string) => {
    setTrades(trades.map((trade) => (trade.id === id ? { ...trade, [field]: value } : trade)))
  }

  const handleConfirmTrade = (id: number) => {
    setTrades(trades.map((trade) => (trade.id === id ? { ...trade, confirmed: true } : trade)))
  }

  const removeTrade = (id: number) => {
    setTrades(trades.filter((trade) => trade.id !== id))
  }

  const handleSave = () => {
    if (isContentMissing) return;

    const noteData = {
      title,
      content,
      category,
      tags,
      is_public,
      pricing: is_public ? pricing : "free",
      price: is_public && pricing === "paid" ? parseFloat(price as string) || 0 : 0,
      trades: trades.filter(trade => trade.confirmed), // Only confirmed trades are sent
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
          <Button onClick={handleSave} disabled={isContentMissing} className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
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
              <p className="mt-2 text-xs text-muted-foreground">Publicにすると本文（Note Content）が必須になります。</p>
            </div>
          </div>

          {is_public && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">Pricing</label>
                <Select value={pricing} onValueChange={(value: "free" | "paid") => setPricing(value)}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {pricing === 'paid' && (
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-2 block">Price (in CIN)</label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g., 100"
                    className="bg-input border-border"
                  />
                </div>
              )}
            </div>
          )}

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

      {/* Note Content (always visible); required when Public */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Note Content{isContentRequired && <span className="ml-2 text-xs text-red-500">(Publicでは必須)</span>}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Record your investment analysis, strategies, market observations, etc..."
            className={`min-h-[300px] bg-input border ${isContentMissing ? 'border-red-500' : 'border-border'} resize-none`}
            aria-invalid={isContentMissing}
            aria-describedby={isContentMissing ? 'content-error' : undefined}
          />
          {isContentMissing && (
            <p id="content-error" className="mt-2 text-sm text-red-500">Publicにする場合は本文の入力が必要です。</p>
          )}
        </CardContent>
      </Card>

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
                <div key={trade.id} className={`p-4 border rounded-lg ${trade.confirmed ? "border-green-500 bg-green-500/10" : "border-border"}`}>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground">Symbol</label>
                      <Select value={trade.symbol} onValueChange={(value) => updateTrade(trade.id, "symbol", value)} disabled={trade.confirmed}>
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue placeholder="Select Symbol" />
                        </SelectTrigger>
                        <SelectContent>
                          {['BTC', 'ETH', 'XRP', 'ADA', 'SOL', 'DOGE'].map((symbol) => (
                            <SelectItem key={symbol} value={symbol}>
                              {symbol}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Type</label>
                      <Select value={trade.type} onValueChange={(value) => updateTrade(trade.id, "type", value)} disabled={trade.confirmed}>
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
                        disabled={trade.confirmed} // Disable inputs if confirmed
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Purchase Price</label>
                      <Input
                        value={formatNumberWithCommas(trade.price)}
                        onChange={(e) => updateTrade(trade.id, "price", e.target.value.replace(/,/g, ''))}
                        placeholder="42,000"
                        className="bg-input border-border"
                        disabled={trade.confirmed} // Disable inputs if confirmed
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Date</label>
                      <Input
                        type="date"
                        value={trade.date}
                        onChange={(e) => updateTrade(trade.id, "date", e.target.value)}
                        className="bg-input border-border"
                        disabled={trade.confirmed} // Disable inputs if confirmed
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <Input
                      value={trade.notes}
                      onChange={(e) => updateTrade(trade.id, "notes", e.target.value)}
                      placeholder="Trade notes..."
                      className="bg-input border-border flex-1 mr-2"
                      disabled={trade.confirmed} // Disable inputs if confirmed
                    />
                    {!trade.confirmed && (
                      <Button size="sm" onClick={() => handleConfirmTrade(trade.id)} className="mr-2 bg-blue-500 text-white hover:bg-blue-600">
                        Confirm
                      </Button>
                    )}
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
