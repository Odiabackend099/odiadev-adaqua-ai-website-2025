import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase env missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  console.error('Current values:', { supabaseUrl, supabaseAnonKey: supabaseAnonKey ? 'SET' : 'MISSING' })
}

export const supabase = createClient(supabaseUrl || 'https://nyrvnskbkitrazudrkkc.supabase.co', supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55cnZuc2tia2l0cmF6dWRya2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NjAwNTQsImV4cCI6MjA3MjMzNjA1NH0.4OjZqbrvXrF3N0CNpzUndh9HTKCtXiadA6NRQv98fCg', {
  auth: { persistSession: true, detectSessionInUrl: true }
})

// Database Types
export interface Profile {
  id: string
  email: string
  created_at: string
}

export interface Assistant {
  id: string
  owner_id: string
  name: string
  persona: 'Ezinne' | 'Lexi' | 'ODIA' | 'Atlas'
  voice_enabled: boolean
  lang: string
  created_at: string
}

export interface Channel {
  id: string
  assistant_id: string
  type: 'web' | 'whatsapp' | 'telegram'
  status: string
  config: Record<string, any>
  created_at: string
}

export interface Message {
  id: number
  assistant_id: string
  role: 'user' | 'assistant'
  text: string
  created_at: string
}

export interface AuditLog {
  id: number
  user_id: string
  action: string
  meta: Record<string, any>
  created_at: string
}

export type User = {
  id: string
  email: string
  full_name?: string
  created_at: string
  last_sign_in_at?: string
}

export type AuthError = {
  message: string
  status?: number
}
