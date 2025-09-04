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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Investment Notes</h1>
          <p className="text-muted-foreground">Manage your investment analysis and strategies</p>
        </div>
        <Button onClick={onCreateNote} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      {/* Filter & Search */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notes..."
                className="pl-10 bg-input border-border"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last Updated</SelectItem>
                <SelectItem value="created">Created Date</SelectItem>
                <SelectItem value="views">Views</SelectItem>
                <SelectItem value="likes">Likes</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              {sortedNotes.length} Notes
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Note List */}
      <div className="grid gap-4">
        {sortedNotes.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">No notes found</h3>
              <p className="text-muted-foreground mb-4">Change your search criteria or create a new note</p>
              <Button onClick={onCreateNote} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                New Note
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
                      <Badge variant={note.isPublic ? "default" : "outline"}>{note.isPublic ? "Public" : "Private"}</Badge>
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
                  {note.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
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
                  <div>Updated: {formatDate(note.updatedAt)}</div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
