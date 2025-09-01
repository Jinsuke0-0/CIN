"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { NotesList } from "@/components/notes/notes-list"
import { NoteEditor } from "@/components/notes/note-editor"
import { Sidebar } from "@/components/dashboard/sidebar"

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

const initialNotes: Note[] = [
  {
    id: "1",
    title: "BTC分析 - 2024年Q1戦略",
    content: "ビットコインの技術分析と今四半期の投資戦略について詳細に分析...",
    category: "技術分析",
    tags: ["BTC", "テクニカル分析", "Q1戦略"],
    isPublic: true,
    views: 234,
    likes: 12,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "ETH ステーキング戦略",
    content: "イーサリアム2.0ステーキングの最適化手法について...",
    category: "DeFi",
    tags: ["ETH", "ステーキング", "DeFi"],
    isPublic: false,
    views: 0,
    likes: 0,
    createdAt: "2024-01-12T14:30:00Z",
    updatedAt: "2024-01-12T14:30:00Z",
  },
  {
    id: "3",
    title: "DeFiプロトコル比較分析",
    content: "主要DeFiプラットフォームの利回り比較と投資戦略...",
    category: "ファンダメンタル分析",
    tags: ["DeFi", "利回り", "比較分析"],
    isPublic: true,
    views: 456,
    likes: 28,
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-10T09:15:00Z",
  },
]

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [currentView, setCurrentView] = useState<"list" | "create" | "edit">("list")
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const storedNotes = localStorage.getItem("notes")
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes))
    } else {
      setNotes(initialNotes)
    }

    const action = searchParams.get("action")
    if (action === "create") {
      setCurrentView("create")
    }
  }, [searchParams])

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  const handleCreateNote = () => {
    setEditingNote(null)
    setCurrentView("create")
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setCurrentView("edit")
  }

  const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>) => {
    if (editingNote) {
      setNotes(
        notes.map((n) =>
          n.id === editingNote.id
            ? { ...editingNote, ...noteData, updatedAt: new Date().toISOString() }
            : n
        )
      )
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        ...noteData,
        views: 0,
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setNotes([newNote, ...notes])
    }
    setCurrentView("list")
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((n) => n.id !== noteId))
  }

  const handleCancel = () => {
    setCurrentView("list")
    setEditingNote(null)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* サイドバー */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-sidebar border-r border-sidebar-border overflow-y-auto">
          <Sidebar />
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto p-6">
          {currentView === "list" && (
            <NotesList
              notes={notes}
              onCreateNote={handleCreateNote}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
            />
          )}
          {(currentView === "create" || currentView === "edit") && (
            <NoteEditor note={editingNote} onSave={handleSaveNote} onCancel={handleCancel} />
          )}
        </main>
      </div>
    </div>
  )
}
