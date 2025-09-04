"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Eye, Heart, Tag, TrendingDown, TrendingUp } from "lucide-react"
import { type Note } from "@/lib/initial-data"

interface NoteDetailViewProps {
  note: Note
  onBack: () => void
}

export function NoteDetailView({ note, onBack }: NoteDetailViewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to list
        </Button>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {note.views}
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            {note.likes}
          </div>
        </div>
      </div>

      {/* Note Details */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-card-foreground">{note.title}</CardTitle>
          <CardDescription>
            <div className="flex items-center gap-4 mt-2 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(note.updatedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="secondary">{note.category}</Badge>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant={note.isPublic ? "default" : "outline"}>
                  {note.isPublic ? "Public" : "Private"}
                </Badge>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {note.content && <p className="text-card-foreground/80 whitespace-pre-wrap">{note.content}</p>}
          <div className="flex flex-wrap gap-2 mt-4">
            <Tag className="h-4 w-4 text-muted-foreground mt-1" />
            {note.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trade Log */}
      {note.trades && note.trades.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Trade Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {note.trades.map((trade) => (
                <div key={trade.id} className="p-4 border border-border rounded-lg flex flex-col md:flex-row gap-4 justify-between">
                  <div className="flex items-center gap-4">
                    {trade.type === "buy" ? (
                      <TrendingUp className="h-6 w-6 text-green-500" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-500" />
                    )}
                    <div>
                      <p className="font-bold text-lg text-card-foreground">{trade.symbol}</p>
                      <p className="text-sm text-muted-foreground">
                        {trade.type.charAt(0).toUpperCase() + trade.type.slice(1)} | {formatDate(trade.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="font-mono text-card-foreground">
                      {trade.amount} @ ${trade.price}
                    </p>
                    <p className="text-sm text-muted-foreground">Total: ${(parseFloat(trade.amount) * parseFloat(trade.price)).toFixed(2)}</p>
                  </div>
                  {trade.notes && (
                    <div className="md:col-span-2 border-t md:border-t-0 md:border-l border-border mt-4 md:mt-0 pt-4 md:pt-0 md:pl-4">
                       <p className="text-sm text-muted-foreground italic">{trade.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
