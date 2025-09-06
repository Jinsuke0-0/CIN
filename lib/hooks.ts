"use client"

import { useState, useEffect, useCallback } from "react"
import { type Note, type Trade } from "@/lib/initial-data"
import { getBrowserSupabase } from "@/lib/supabase" // Lazy-get supabase client for browser

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userId = typeof window !== 'undefined' ? localStorage.getItem("walletAddress") : null;

  useEffect(() => {
    const fetchNotes = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
  const supabase = getBrowserSupabase();
  const { data, error } = await supabase
        .from('notes')
        .select('*, trades(*)') // Select trades along with the note
        .or(`user_id.eq.${userId},is_public.eq.true`); // Filter by user_id OR is_public

      if (error) {
        console.error("Error fetching notes:", error);
        setError(error.message);
        setNotes([]);
      } else {
        const formattedNotes = (data as DBNote[]).map(mapDBNoteToNote);
        setNotes(formattedNotes);
      }
      setLoading(false);
    };

    fetchNotes();
  }, [userId]); // Re-fetch when userId changes

  // Accept note data without id/user_id/timestamps and without views/likes (set server-side defaults)
  const addNote = useCallback(async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'user_id' | 'views' | 'likes'>) => {
    if (!userId) {
      setError("User not authenticated.");
      return;
    }

  // Separate trades from the noteData
  const { trades, is_public, ...noteToInsert } = noteData;

  // Prepare row for notes table (trades are handled in a separate table)
  const newNote: Omit<Note, 'createdAt' | 'updatedAt' | 'trades'> = { // Omit only timestamps and trades here
      id: crypto.randomUUID(), // Generate a unique ID
      ...noteToInsert,
      user_id: userId, // Changed from userId to user_id
      views: 0,
      likes: 0,
  is_public: typeof is_public === 'boolean' ? is_public : false,
    };

  const supabase = getBrowserSupabase();
  const { data: insertedNote, error: insertError } = await supabase
      .from('notes')
      .insert([newNote])
      .select()
      .single();

    if (insertError) {
      console.error("Error adding note:", JSON.stringify(insertError, null, 2));
      setError(insertError.message);
      return;
    }

    if (insertedNote && trades && trades.length > 0) {
  const tradesToInsert = trades.map((trade: NonNullable<Note['trades']>[number]) => ({
        ...trade,
        note_id: insertedNote.id, // Link trades to the new note
      }));

  const { error: tradesError } = await supabase
        .from('trades')
        .insert(tradesToInsert);

      if (tradesError) {
        console.error("Error adding trades:", JSON.stringify(tradesError, null, 2));
        setError(tradesError.message);
        // Optionally, you might want to delete the inserted note if trades insertion fails
        // await supabase.from('notes').delete().eq('id', insertedNote.id);
        return;
      }
    }

    if (insertedNote) {
      // Re-fetch the note with trades to update the local state correctly
  const { data: fullNote, error: fetchError } = await supabase
        .from('notes')
        .select('*, trades(*)') // Select trades along with the note
        .eq('id', insertedNote.id)
        .single();

      if (fetchError) {
        console.error("Error fetching full note after insert:", JSON.stringify(fetchError, null, 2));
        setError(fetchError.message);
      } else if (fullNote) {
        const normalized = mapDBNoteToNote(fullNote as DBNote);
        setNotes((prevNotes) => [normalized, ...prevNotes]);
      }
    }
  }, [userId]);

  const updateNote = useCallback(async (noteId: string, noteData: Partial<Omit<Note, 'id' | 'user_id'>>) => {
  const supabase = getBrowserSupabase();
  const { data, error: updateError } = await supabase
      .from('notes')
      .update(noteData)
      .eq('id', noteId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating note:", JSON.stringify(updateError, null, 2));
      setError(updateError.message);
    } else if (data) {
      const normalized = mapDBNoteToNote(data as DBNote);
      setNotes((prevNotes) => prevNotes.map((n) => (n.id === noteId ? normalized : n)));
    }
  }, []);

  const deleteNote = useCallback(async (noteId: string) => {
  const supabase = getBrowserSupabase();
  const { error: deleteError } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);

    if (deleteError) {
      console.error("Error deleting note:", deleteError);
      setError(deleteError.message);
    } else {
      setNotes((prevNotes) => prevNotes.filter((n) => n.id !== noteId));
    }
  }, []);

  const incrementView = useCallback(async (noteId: string) => {
  const supabase = getBrowserSupabase();
  const { error } = await supabase.rpc('increment_view', {
      note_id_arg: noteId,
    });

    if (error) {
      console.error("Error incrementing view:", JSON.stringify(error, null, 2));
    } else {
      setNotes((prevNotes) =>
        prevNotes.map((n) =>
          n.id === noteId ? { ...n, views: n.views + 1 } : n
        )
      );
    }
  }, []);

  return { notes, addNote, updateNote, deleteNote, incrementView, loading, error };
}

export function usePublicNotes() {
  const [publicNotes, setPublicNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicNotes = async () => {
      setLoading(true);
      setError(null);
  const supabase = getBrowserSupabase();
  const { data, error } = await supabase
        .from('notes')
        .select('*, trades(*)')
        .eq('is_public', true); // Filter by is_public

      if (error) {
        console.error("Error fetching public notes:", error);
        setError(error.message);
        setPublicNotes([]);
      } else {
        const formattedNotes = (data as DBNote[]).map(mapDBNoteToNote);
        setPublicNotes(formattedNotes);
      }
      setLoading(false);
    };

    fetchPublicNotes();
  }, []); // No dependency on userId, fetches all public notes

  return { publicNotes, loading, error };
}

// ----- Types and helpers to normalize DB rows to Note interface -----
type DBNote = Omit<Note, 'createdAt' | 'updatedAt'> & {
  created_at: string;
  updated_at: string;
  trades?: Trade[];
};

function mapDBNoteToNote(row: DBNote): Note {
  return {
    ...row,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  } as Note;
}
