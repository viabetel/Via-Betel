"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"

/**
 * Hook para sincronizar localStorage (fallback) com Supabase (persistência)
 * Usado para favoritos, comparações e buscas salvas
 */

export function useMarketplaceSync() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<string[]>([])
  const [compareList, setCompareList] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load from localStorage first (instant), then sync with Supabase
  useEffect(() => {
    // Load from localStorage immediately
    if (typeof window !== "undefined") {
      const storedFavorites = localStorage.getItem("via-betel-favorites")
      const storedCompare = localStorage.getItem("via-betel-compare")
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites))
      if (storedCompare) setCompareList(JSON.parse(storedCompare))
    }

    setIsLoading(false)
  }, [])

  // Sync with Supabase when user logs in
  useEffect(() => {
    if (!user) return

    const syncWithSupabase = async () => {
      const supabase = createClient()

      try {
        // Load favorites from Supabase
        const { data: favData } = await supabase.from("favorites").select("instructor_slug").eq("user_id", user.id)

        if (favData) {
          const remoteFavorites = favData.map((f) => f.instructor_slug)
          setFavorites(remoteFavorites)
          localStorage.setItem("via-betel-favorites", JSON.stringify(remoteFavorites))
        }

        // Load comparisons from Supabase
        const { data: compData } = await supabase.from("comparisons").select("instructor_slug").eq("user_id", user.id)

        if (compData) {
          const remoteCompare = compData.map((c) => c.instructor_slug)
          setCompareList(remoteCompare)
          localStorage.setItem("via-betel-compare", JSON.stringify(remoteCompare))
        }
      } catch (error) {
        console.warn("[v0] Could not sync with Supabase. Tables might not exist yet:", error)
      }
    }

    syncWithSupabase()
  }, [user])

  const toggleFavorite = async (instructorSlug: string, instructorName: string) => {
    const newFavorites = favorites.includes(instructorSlug)
      ? favorites.filter((s) => s !== instructorSlug)
      : [...favorites, instructorSlug]

    setFavorites(newFavorites)
    localStorage.setItem("via-betel-favorites", JSON.stringify(newFavorites))

    // Sync to Supabase if logged in
    if (user) {
      const supabase = createClient()
      try {
        if (newFavorites.includes(instructorSlug)) {
          await supabase.from("favorites").insert({
            user_id: user.id,
            instructor_slug: instructorSlug,
            instructor_name: instructorName,
          })
        } else {
          await supabase.from("favorites").delete().eq("user_id", user.id).eq("instructor_slug", instructorSlug)
        }
      } catch (error) {
        console.warn("[v0] Could not sync favorite to Supabase:", error)
      }
    }

    return newFavorites.includes(instructorSlug)
  }

  const toggleCompare = async (instructorSlug: string, instructorName: string) => {
    const newCompare = compareList.includes(instructorSlug)
      ? compareList.filter((s) => s !== instructorSlug)
      : [...compareList, instructorSlug]

    setCompareList(newCompare)
    localStorage.setItem("via-betel-compare", JSON.stringify(newCompare))

    // Sync to Supabase if logged in
    if (user) {
      const supabase = createClient()
      try {
        if (newCompare.includes(instructorSlug)) {
          await supabase.from("comparisons").insert({
            user_id: user.id,
            instructor_slug: instructorSlug,
            instructor_name: instructorName,
          })
        } else {
          await supabase.from("comparisons").delete().eq("user_id", user.id).eq("instructor_slug", instructorSlug)
        }
      } catch (error) {
        console.warn("[v0] Could not sync comparison to Supabase:", error)
      }
    }

    return newCompare.includes(instructorSlug)
  }

  const clearCompare = async () => {
    setCompareList([])
    localStorage.removeItem("via-betel-compare")

    if (user) {
      const supabase = createClient()
      try {
        await supabase.from("comparisons").delete().eq("user_id", user.id)
      } catch (error) {
        console.warn("[v0] Could not clear comparisons in Supabase:", error)
      }
    }
  }

  return {
    favorites,
    compareList,
    isLoading,
    toggleFavorite,
    toggleCompare,
    clearCompare,
  }
}
