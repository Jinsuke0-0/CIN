"use client"

import { useState } from "react"
import { NoteFeed } from "@/components/community/note-feed"
import { NoteDetail } from "@/components/community/note-detail"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function CommunityPage() {
  const [currentView, setCurrentView] = useState<"feed" | "detail">("feed")
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)

  const handleViewNote = (noteId: string) => {
    setSelectedNoteId(noteId)
    setCurrentView("detail")
  }

  const handleBackToFeed = () => {
    setCurrentView("feed")
    setSelectedNoteId(null)
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
          {currentView === "feed" && <NoteFeed />}
          {currentView === "detail" && selectedNoteId && (
            <NoteDetail noteId={selectedNoteId} onBack={handleBackToFeed} />
          )}
        </main>
      </div>
    </div>
  )
}
