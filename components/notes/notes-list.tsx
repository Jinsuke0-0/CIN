"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Search, Filter, Eye, Heart, Edit, Trash2, Plus } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  isPublic: boolean
  views: number
  likes: number
  createdAt: string
  updatedAt: string
}

interface NotesListProps {
  notes: Note[]
  onCreateNote: () => void
  onEditNote: (note: Note) => void
  onDeleteNote: (noteId: string) => void
}

export function NotesList({ notes, onCreateNote, onEditNote, onDeleteNote }: NotesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("updated")

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
    "その他",
  ]

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case "updated":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      case "created":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "views":
        return b.views - a.views
      case "likes":
        return b.likes - a.likes
      default:
        return 0
    }
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">投資ノート</h1>
          <p className="text-muted-foreground">あなたの投資分析と戦略を管理</p>
        </div>
        <Button onClick={onCreateNote} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          新しいノート
        </Button>
      </div>

      {/* フィルター・検索 */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    {category === "all" ? "すべてのカテゴリ" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="並び順" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">更新日順</SelectItem>
                <SelectItem value="created">作成日順</SelectItem>
                <SelectItem value="views">閲覧数順</SelectItem>
                <SelectItem value="likes">いいね順</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              {sortedNotes.length} 件のノート
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ノート一覧 */}
      <div className="grid gap-4">
        {sortedNotes.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">ノートが見つかりません</h3>
              <p className="text-muted-foreground mb-4">検索条件を変更するか、新しいノートを作成してください</p>
              <Button onClick={onCreateNote} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                新しいノート
              </Button>
            </CardContent>
          </Card>
        ) : (
          sortedNotes.map((note) => (
            <Card key={note.id} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-card-foreground hover:text-primary cursor-pointer">
                      {note.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{note.category}</Badge>
                      <Badge variant={note.isPublic ? "default" : "outline"}>{note.isPublic ? "公開" : "非公開"}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEditNote(note)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDeleteNote(note.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 line-clamp-2">{note.content}</CardDescription>

                <div className="flex flex-wrap gap-1 mb-4">
                  {note.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {note.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {note.likes}
                    </div>
                  </div>
                  <div>更新: {formatDate(note.updatedAt)}</div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}