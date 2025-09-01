"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface NoteFeedProps {
  title: string
  subtitle: string
}

export function NoteFeed({ title, subtitle }: NoteFeedProps) {
  // This is a placeholder for the actual note feed logic.
  // In a real application, you would fetch notes from an API and render them here.
  const notes = [
    { id: 1, title: "My First Investment Note", content: "This is the content of my first investment note.", author: "John Doe", date: "2023-01-15", tags: ["Crypto", "Beginner", "Portfolio"] },
    { id: 2, title: "Analyzing Bitcoin Performance", content: "A deep dive into Bitcoin's recent price movements.", author: "Jane Smith", date: "2023-02-20", tags: ["Bitcoin", "Analysis", "Market"] },
    { id: 3, title: "Ethereum Staking Guide", content: "How to stake Ethereum and earn passive income.", author: "Peter Jones", date: "2023-03-10", tags: ["Ethereum", "Staking", "DeFi"] },
  ]

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
          <Card key={note.id} className="flex flex-col bg-neutral-900 text-gray-100 border border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-xl">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xl font-semibold text-white">{note.title}</CardTitle>
              <CardDescription className="text-xs text-gray-400">By {note.author} on {note.date}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow p-4 pt-0">
              <p className="text-gray-400 line-clamp-3 text-sm">{note.content}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-gray-700 text-gray-200 hover:bg-gray-600">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <div className="p-4 pt-0">
              <Button variant="link" className="px-0 text-primary hover:text-primary/80">Read More</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

