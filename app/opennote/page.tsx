"use client"

import { NoteFeed } from "@/components/community/note-feed"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function OpenNotePage() {
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
          <NoteFeed title="Open Note" subtitle="公開されている投資ノートを閲覧します" />
        </main>
      </div>
    </div>
  )
}