"use client"

import { useMemo } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { NoteFeed } from "@/components/notes/note-feed"
import { useNotes } from "@/lib/hooks"

export default function OpenNotePage() {
  const { notes } = useNotes()

  const publicNotes = useMemo(() => {
    return notes.filter((note) => note.isPublic)
  }, [notes])

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
          <NoteFeed
            title="Open Notes"
            subtitle="Browse publicly shared investment notes."
            notes={publicNotes}
          />
        </main>
      </div>
    </div>
  )
}
