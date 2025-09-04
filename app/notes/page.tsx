"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { NotesList } from "@/components/notes/notes-list"
import { NoteEditor } from "@/components/notes/note-editor"
import { Sidebar } from "@/components/dashboard/sidebar"
import { useNotes } from "@/lib/hooks"
import { type Note } from "@/lib/initial-data"

export default function NotesPage() {
  const { notes, addNote, updateNote, deleteNote } = useNotes()
  const [currentView, setCurrentView] = useState<"list" | "create" | "edit">("list")
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const action = searchParams.get("action")
    if (action === "create") {
      setCurrentView("create")
    }
  }, [searchParams])

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
      updateNote(editingNote.id, noteData)
    } else {
      addNote(noteData)
    }
    setCurrentView("list")
  }

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId)
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
