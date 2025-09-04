"use client"

import { useState, useEffect, useCallback } from "react"
import { type Note, initialNotes } from "@/lib/initial-data"

const NOTES_STORAGE_KEY = "notes"

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY)
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes))
      } else {
        setNotes(initialNotes)
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(initialNotes))
      }
    } catch (error) {
      console.error("Failed to parse notes from localStorage", error)
      setNotes(initialNotes)
    }
  }, [])

  const updateLocalStorage = (newNotes: Note[]) => {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(newNotes))
    // Manually dispatch a storage event to notify other hooks on the same page.
    // Use setTimeout to avoid the "Cannot update a component while rendering a different component" error.
    setTimeout(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: NOTES_STORAGE_KEY,
          newValue: JSON.stringify(newNotes),
        })
      )
    }, 0)
  }

  const addNote = useCallback((noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>) => {
    setNotes((prevNotes) => {
      const newNote: Note = {
        id: crypto.randomUUID(),
        ...noteData,
        views: 0,
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const newNotes = [newNote, ...prevNotes]
      updateLocalStorage(newNotes)
      return newNotes
    })
  }, [])

  const updateNote = useCallback((noteId: string, noteData: Partial<Omit<Note, 'id'>>) => {
    setNotes((prevNotes) => {
      const newNotes = prevNotes.map((n) =>
        n.id === noteId ? { ...n, ...noteData, updatedAt: new Date().toISOString() } : n
      )
      updateLocalStorage(newNotes)
      return newNotes
    })
  }, [])

  const deleteNote = useCallback((noteId: string) => {
    setNotes((prevNotes) => {
      const newNotes = prevNotes.filter((n) => n.id !== noteId)
      updateLocalStorage(newNotes)
      return newNotes
    })
  }, [])

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === NOTES_STORAGE_KEY && event.newValue) {
        try {
          setNotes(JSON.parse(event.newValue))
        } catch (error) {
          console.error("Failed to parse notes from storage event", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  return { notes, addNote, updateNote, deleteNote }
}
