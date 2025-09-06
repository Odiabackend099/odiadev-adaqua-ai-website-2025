import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nyrvnskbkitrazudrkkc.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
