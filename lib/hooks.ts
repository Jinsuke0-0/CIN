"use client";

import { useState, useEffect, useCallback } from "react";
import { type Note, type Trade } from "@/lib/initial-data";
import { getBrowserSupabase } from "@/lib/supabase";
import { useAuth } from "@/app/auth/context";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { account: userId } = useAuth(); // Use account from useAuth as userId

  useEffect(() => {
    const fetchNotes = async () => {
      if (!userId) {
        setNotes([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const supabase = getBrowserSupabase();
        const { data, error } = await supabase
          .from("notes")
          .select("*, trades(*)")
          .or(`user_id.eq.${userId},is_public.eq.true`);

        if (error) {
          console.error("Error fetching notes:", error);
          setError(error.message);
          setNotes([]);
        } else {
          const formattedNotes = (data as DBNote[]).map(mapDBNoteToNote);
          setNotes(formattedNotes);
        }
      } catch (e) {
        console.error("Supabase client not available:", e);
        setError(
          "Supabase client is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
        );
        setNotes([]);
      }
      setLoading(false);
    };

    fetchNotes();
  }, [userId]); // Re-fetch when userId changes

  const addNote = useCallback(
    async (
      noteData: Omit<
        Note,
        "id" | "createdAt" | "updatedAt" | "user_id" | "views" | "likes"
      >
    ): Promise<boolean> => {
      if (!userId) {
        setError("User not authenticated.");
        return false;
      }

      const { trades, is_public, ...noteToInsert } = noteData;

      const newNote: Omit<Note, "createdAt" | "updatedAt" | "trades"> = {
        id: crypto.randomUUID(),
        ...noteToInsert,
        user_id: userId,
        views: 0,
        likes: 0,
        is_public: typeof is_public === "boolean" ? is_public : false,
      };

      let supabase;
      try {
        supabase = getBrowserSupabase();
      } catch (e) {
        console.error("Supabase client not available:", e);
        setError(
          "Supabase client is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
        );
        return false;
      }
      const { data: insertedNote, error: insertError } = await supabase
        .from("notes")
        .insert([newNote])
        .select()
        .single();

      if (insertError) {
        console.error("Error adding note:", JSON.stringify(insertError, null, 2));
        setError(insertError.message);
        return false;
      }

      if (insertedNote && trades && trades.length > 0) {
        const tradesToInsert = trades.map(
          (trade: NonNullable<Note["trades"]>[number]) => ({
            ...trade,
            note_id: insertedNote.id,
          })
        );

        const { error: tradesError } = await supabase
          .from("trades")
          .insert(tradesToInsert);

        if (tradesError) {
          console.error(
            "Error adding trades:",
            JSON.stringify(tradesError, null, 2)
          );
          setError(tradesError.message);
          return false;
        }
      }

      if (insertedNote) {
        const { data: fullNote, error: fetchError } = await supabase
          .from("notes")
          .select("*, trades(*)")
          .eq("id", insertedNote.id)
          .single();

        if (fetchError) {
          console.error(
            "Error fetching full note after insert:",
            JSON.stringify(fetchError, null, 2)
          );
          setError(fetchError.message);
          return false;
        } else if (fullNote) {
          const normalized = mapDBNoteToNote(fullNote as DBNote);
          setNotes((prevNotes) => [normalized, ...prevNotes]);
          return true;
        }
      }
      return false;
    },
    [userId]
  );

  const updateNote = useCallback(
    async (
      noteId: string,
      noteData: Partial<Omit<Note, "id" | "user_id">>
    ): Promise<boolean> => {
      let supabase;
      try {
        supabase = getBrowserSupabase();
      } catch (e) {
        console.error("Supabase client not available:", e);
        setError(
          "Supabase client is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
        );
        return false;
      }
      const { data, error: updateError } = await supabase
        .from("notes")
        .update(noteData)
        .eq("id", noteId)
        .select()
        .single();

      if (updateError) {
        console.error(
          "Error updating note:",
          JSON.stringify(updateError, null, 2)
        );
        setError(updateError.message);
        return false;
      } else if (data) {
        const normalized = mapDBNoteToNote(data as DBNote);
        setNotes((prevNotes) =>
          prevNotes.map((n) => (n.id === noteId ? normalized : n))
        );
        return true;
      }
      return false;
    },
    []
  );

  const deleteNote = useCallback(async (noteId: string) => {
    let supabase;
    try {
      supabase = getBrowserSupabase();
    } catch (e) {
      console.error("Supabase client not available:", e);
      setError(
        "Supabase client is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
      return;
    }
    const { error: deleteError } = await supabase
      .from("notes")
      .delete()
      .eq("id", noteId);

    if (deleteError) {
      console.error("Error deleting note:", deleteError);
      setError(deleteError.message);
    } else {
      setNotes((prevNotes) => prevNotes.filter((n) => n.id !== noteId));
    }
  }, []);

  const incrementView = useCallback(async (noteId: string) => {
    let supabase;
    try {
      supabase = getBrowserSupabase();
    } catch (e) {
      console.error("Supabase client not available:", e);
      setError(
        "Supabase client is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
      return;
    }
    const { error } = await supabase.rpc("increment_view", {
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
      try {
        const supabase = getBrowserSupabase();
        const { data, error } = await supabase
          .from("notes")
          .select("*, trades(*)")
          .eq("is_public", true); // Filter by is_public

        if (error) {
          console.error("Error fetching public notes:", error);
          setError(error.message);
          setPublicNotes([]);
        } else {
          const formattedNotes = (data as DBNote[]).map(mapDBNoteToNote);
          setPublicNotes(formattedNotes);
        }
      } catch (e) {
        console.error("Supabase client not available:", e);
        setError(
          "Supabase client is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
        );
        setPublicNotes([]);
      }
      setLoading(false);
    };

    fetchPublicNotes();
  }, []); // No dependency on userId, fetches all public notes

  return { publicNotes, loading, error };
}

// ----- Types and helpers to normalize DB rows to Note interface -----
type DBNote = Omit<Note, "createdAt" | "updatedAt"> & {
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
