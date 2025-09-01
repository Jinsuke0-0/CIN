"use client"

import { useState } from "react"
import { NotesList } from "@/components/notes/notes-list"
import { NoteEditor } from "@/components/notes/note-editor"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function NotesPage() {
  const [currentView, setCurrentView] = useState<"list" | "create" | "edit">("list")
  const [editingNote, setEditingNote] = useState<any>(null)

  const handleCreateNote = () => {
    setEditingNote(null)
    setCurrentView("create")
  }

  const handleEditNote = (note: any) => {
    setEditingNote(note)
    setCurrentView("edit")
  }

  const handleSaveNote = (noteData: any) => {
    // ここで実際のデータ保存処理を行う
    console.log("Saving note:", noteData)
    setCurrentView("list")
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
          {currentView === "list" && <NotesList onCreateNote={handleCreateNote} onEditNote={handleEditNote} />}
          {(currentView === "create" || currentView === "edit") && (
            <NoteEditor note={editingNote} onSave={handleSaveNote} onCancel={handleCancel} />
          )}
        </main>
      </div>
    </div>
  )
}
