"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN"
  phone: string | null
  city: string | null
  avatar_url: string | null
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const loadUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        try {
          const { data: profileData, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

          if (error && error.code === "PGRST205") {
            console.warn(
              "[v0] Profiles table doesn't exist yet. Please run scripts/002_complete_trust_system.sql in Supabase SQL Editor",
            )
            // Fallback: create profile from user metadata
            setProfile({
              id: user.id,
              email: user.email || "",
              full_name: user.user_metadata?.full_name || null,
              role: user.user_metadata?.role || "STUDENT",
              phone: user.user_metadata?.phone || null,
              city: user.user_metadata?.city || null,
              avatar_url: user.user_metadata?.avatar_url || null,
            })
          } else if (profileData) {
            setProfile(profileData)
          } else {
            setProfile(null)
          }
        } catch (profileError) {
          console.error("[v0] Error loading profile:", profileError)
          setProfile({
            id: user.id,
            email: user.email || "",
            full_name: user.user_metadata?.full_name || null,
            role: user.user_metadata?.role || "STUDENT",
            phone: user.user_metadata?.phone || null,
            city: user.user_metadata?.city || null,
            avatar_url: user.user_metadata?.avatar_url || null,
          })
        }
      } else {
        setProfile(null)
      }
    } catch (error) {
      console.error("[v0] Error loading user:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUser()
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const refresh = async () => {
    await loadUser()
  }

  return <AuthContext.Provider value={{ user, profile, loading, signOut, refresh }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
