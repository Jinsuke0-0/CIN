"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type Note } from "@/lib/initial-data"

interface NoteFeedProps {
  title: string
  subtitle: string
  notes: Note[]
}

export function NoteFeed({ title, subtitle, notes }: NoteFeedProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-8">
      <Card className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-4xl font-extrabold tracking-tight lg:text-5xl">{title}</CardTitle>
          <CardDescription className="text-lg text-gray-400">{subtitle}</CardDescription>
        </CardHeader>
      </Card>
      <Separator className="bg-gray-700" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Link href={`/notes?noteId=${note.id}`} key={note.id} passHref>
            <Card className="flex flex-col bg-neutral-900 text-gray-100 border border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-xl h-full">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xl font-semibold text-white">{note.title}</CardTitle>
                <CardDescription className="text-xs text-gray-400">Updated on {formatDate(note.updatedAt)}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow p-4 pt-0">
                <p className="text-gray-400 line-clamp-3 text-sm">{note.content}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {note.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-200 hover:bg-gray-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <div className="p-4 pt-0 mt-auto">
                <Button variant="link" className="px-0 text-primary hover:text-primary/80">Read More</Button>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

