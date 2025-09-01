"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Eye, Heart } from "lucide-react"

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

export function RecentNotes() {
  const [recentNotes, setRecentNotes] = useState<Note[]>([])

  useEffect(() => {
    const storedNotes = localStorage.getItem("notes")
    if (storedNotes) {
      const notes: Note[] = JSON.parse(storedNotes)
      // Sort by updatedAt and take the top 3
      const sortedNotes = notes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      setRecentNotes(sortedNotes.slice(0, 3))
    }
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Recent Investment Notes</CardTitle>
        <CardDescription>Your latest investment analysis and strategies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentNotes.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No notes yet.</p>
          ) : (
            recentNotes.map((note) => (
              <div key={note.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary mt-1" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-card-foreground">{note.title}</h4>
                    <p className="text-xs text-muted-foreground">{note.content.substring(0, 50)}...</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={note.isPublic ? "default" : "secondary"}>{note.isPublic ? "Public" : "Private"}</Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(note.updatedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {note.views}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {note.likes}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <Link href="/notes" passHref>
          <Button variant="outline" className="w-full mt-4 bg-transparent">
            View all notes
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
