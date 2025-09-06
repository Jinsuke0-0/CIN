"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Eye, Heart, Tag, TrendingDown, TrendingUp, Lock } from "lucide-react"
import { type Note } from "@/lib/initial-data"
import { useNotes } from "@/lib/hooks"
import { ethers } from "ethers";
import CINTokenABI from "@/lib/abi/CINToken.json";

const CIN_TOKEN_ADDRESS = "0xD6533D9b1705c01D048D8CcA087F0426d1A09d08"; // <<< IMPORTANT: Replace with your deployed CIN Token contract address

// Helper to format numbers with commas
const formatNumberWithCommas = (value: string) => {
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return num.toLocaleString('en-US'); // Formats with commas
};

interface NoteDetailViewProps {
  note: Note
  onBack: () => void
}

export function NoteDetailView({ note, onBack }: NoteDetailViewProps) {
  const [isPurchased, setIsPurchased] = useState(false);
  const { incrementView } = useNotes();
  const hasIncrementedView = useRef(false);

  useEffect(() => {
    if (note.id && !hasIncrementedView.current) {
      incrementView(note.id);
      hasIncrementedView.current = true;
    }
  }, [note.id, incrementView]);

  const handlePurchase = async () => {
    if (!window.ethereum) {
      alert("MetaMask or a compatible wallet is not installed.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(CIN_TOKEN_ADDRESS, CINTokenABI.abi, signer);

      // Convert note.price to BigInt considering 18 decimals for ERC-20 tokens
      // Assuming note.price is a whole number (e.g., 100 for 100 CIN)
      const amountToTransfer = ethers.parseUnits(note.price.toString(), 18);

      console.log(`Attempting to transfer ${note.price} CIN to ${note.user_id}`);

      const tx = await tokenContract.transfer(note.user_id, amountToTransfer);
      alert("Transaction sent! Please confirm in your wallet.");

      const receipt = await tx.wait(); // Wait for the transaction to be mined
      console.log("Transaction successful:", receipt);

      setIsPurchased(true);
      alert(`You have successfully purchased the note for ${note.price} CIN!`);

    } catch (error: unknown) {
      console.error("Error during purchase:", error);
      alert(`Purchase failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const isPaywalled = note.pricing === 'paid' && !isPurchased;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to list
        </Button>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {note.is_public && (
            <>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {note.views}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {note.likes}
              </div>
            </>
          )}
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
                <span>Created: {formatDate(note.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Updated: {formatDate(note.updatedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="secondary">{note.category}</Badge>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant={note.is_public ? "default" : "outline"}>
                  {note.is_public ? "Public" : "Private"}
                </Badge>
              </div>
              {note.pricing === 'paid' && (
                <div className="flex items-center gap-1">
                  <Badge variant="destructive">Paid Content</Badge>
                </div>
              )}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPaywalled ? (
            <div className="text-center py-12 bg-muted/20 rounded-lg">
              <Lock className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-2xl font-bold text-card-foreground">This Content is Locked</h2>
              <p className="mt-2 text-muted-foreground">Purchase this note to unlock and view the full content.</p>
              <Button onClick={handlePurchase} className="mt-6 bg-primary hover:bg-primary/90">
                Purchase for {note.price} CIN
              </Button>
            </div>
          ) : (
            <>
              {note.content && <p className="text-card-foreground/80 whitespace-pre-wrap">{note.content}</p>}
              <div className="flex flex-wrap gap-2 mt-4">
                <Tag className="h-4 w-4 text-muted-foreground mt-1" />
                {note.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </>
          )}
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
                      {trade.amount} @ ${formatNumberWithCommas(trade.price)}
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
