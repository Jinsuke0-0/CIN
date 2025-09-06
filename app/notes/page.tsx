"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { NotesList } from "@/components/notes/notes-list"
import { NoteEditor } from "@/components/notes/note-editor"
import { Sidebar } from "@/components/dashboard/sidebar"
import { useNotes } from "@/lib/hooks"
import { type Note } from "@/lib/initial-data"
import { NoteDetailView } from "@/components/notes/note-detail-view"

function NotesPageContent() {
  const { notes, addNote, updateNote, deleteNote } = useNotes()
  const [currentView, setCurrentView] = useState<"list" | "create" | "edit" | "view">("list")
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [viewingNote, setViewingNote] = useState<Note | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const returnPath = searchParams.get("returnPath") || "/notes";

  useEffect(() => {
    const noteId = searchParams.get("noteId")
    const action = searchParams.get("action")

    if (noteId) {
      const noteToView = notes.find((n) => n.id === noteId)
      if (noteToView) {
        setViewingNote(noteToView)
        setCurrentView("view")
      } else {
        setCurrentView("list")
      }
    } else if (action === "create") {
      setEditingNote(null)
      setCurrentView("create")
    } else {
      setCurrentView("list")
    }
  }, [searchParams, notes])

  const handleCreateNote = () => {
    setEditingNote(null)
    setCurrentView("create")
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setCurrentView("edit")
  }

  const handleViewNote = (note: Note) => {
    setViewingNote(note)
    setCurrentView("view")
    // Update URL without reloading page
    window.history.pushState({}, "", `/notes?noteId=${note.id}`)
  }

  const handleSaveNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'user_id'>) => {
    const ok = editingNote
      ? await updateNote(editingNote.id, noteData)
      : await addNote(noteData)
    if (ok) {
      router.push("/notes")
    } else {
      alert("Failed to save note. Please check required fields and try again.")
    }
  }

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId)
    if (viewingNote?.id === noteId) {
      setCurrentView("list")
      setViewingNote(null)
    }
  }

  const handleCancel = () => {
    setCurrentView("list")
    setEditingNote(null)
    window.history.pushState({}, "", "/notes")
  }

  const handleBackToList = () => {
    setCurrentView("list")
    setViewingNote(null)
    router.push(returnPath)
  }

  const renderContent = () => {
    switch (currentView) {
      case "view":
        return viewingNote ? <NoteDetailView note={viewingNote} onBack={handleBackToList} /> : null
      case "create":
      case "edit":
        return <NoteEditor note={editingNote === null ? undefined : editingNote} onSave={handleSaveNote} onCancel={handleCancel} />
      case "list":
      default:
        return (
          <NotesList
            notes={notes}
            onCreateNote={handleCreateNote}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
            onViewNote={handleViewNote}
          />
        )
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-sidebar border-r border-sidebar-border overflow-y-auto">
          <Sidebar />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  )
}

export default function NotesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotesPageContent />
    </Suspense>
  )
}
