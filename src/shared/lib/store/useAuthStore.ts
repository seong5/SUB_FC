'use client'

import { create } from 'zustand'
import { type Session, User } from '@supabase/supabase-js'

type AuthState = {
  loading: boolean
  session: Session | null
  user: User | null
  setLoading: (b: boolean) => void
  setSession: (s: Session | null) => void
  logoutLocal: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  loading: true,
  session: null,
  user: null,
  setLoading: (b) => set({ loading: b }),
  setSession: (session) => set({ session, user: session?.user ?? null }),
  logoutLocal: () => set({ session: null, user: null }),
}))

export const useIsLoggedIn = () => useAuthStore((s) => !!s.user)
export const useAuthUser = () => useAuthStore((s) => s.user)
export const useAuthLoading = () => useAuthStore((s) => s.loading)
