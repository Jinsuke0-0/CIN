"use client"

import { useState, useEffect, useCallback } from "react"
import { type Note } from "@/lib/initial-data"
import { supabase } from "@/lib/supabase" // Import supabase client

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
      const { data, error } = await supabase
        .from('notes')
        .select('*, trades(*)') // Select trades along with the note
        .or(`user_id.eq.${userId},is_public.eq.true`); // Filter by user_id OR is_public

      if (error) {
        console.error("Error fetching notes:", error);
        setError(error.message);
        setNotes([]);
      } else {
        const formattedNotes = data.map(note => ({
          ...note,
          createdAt: note.created_at,
          updatedAt: note.updated_at,
          is_public: note.is_public,
        }));
        setNotes(formattedNotes as Note[]);
      }
      setLoading(false);
    };

    fetchNotes();
  }, [userId]); // Re-fetch when userId changes

  const addNote = useCallback(async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'user_id' | 'is_public'>) => {
    if (!userId) {
      setError("User not authenticated.");
      return;
    }

    // Separate trades from the noteData
    const { trades, ...noteToInsert } = noteData;

    const newNote: Omit<Note, 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'trades'> = { // Omit trades here
      id: crypto.randomUUID(), // Generate a unique ID
      ...noteToInsert,
      user_id: userId, // Changed from userId to user_id
      views: 0,
      likes: 0,
      is_public: noteToInsert.is_public !== undefined ? noteToInsert.is_public : false,
    };

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
      const tradesToInsert = trades.map(trade => ({
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
        setNotes((prevNotes) => [fullNote as Note, ...prevNotes]);
      }
    }
  }, [userId]);

  const updateNote = useCallback(async (noteId: string, noteData: Partial<Omit<Note, 'id' | 'user_id' | 'is_public'>>) => {
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
      setNotes((prevNotes) =>
        prevNotes.map((n) => (n.id === noteId ? (data as Note) : n))
      );
    }
  }, []);

  const deleteNote = useCallback(async (noteId: string) => {
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
      const { data, error } = await supabase
        .from('notes')
        .select('*, trades(*)')
        .eq('is_public', true); // Filter by is_public

      if (error) {
        console.error("Error fetching public notes:", error);
        setError(error.message);
        setPublicNotes([]);
      } else {
        const formattedNotes = data.map(note => ({
          ...note,
          createdAt: note.created_at,
          updatedAt: note.updated_at,
          is_public: note.is_public,
        }));
        setPublicNotes(formattedNotes as Note[]);
      }
      setLoading(false);
    };

    fetchPublicNotes();
  }, []); // No dependency on userId, fetches all public notes

  return { publicNotes, loading, error };
}
