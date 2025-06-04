import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Form {
  id: string
  user_id: string
  title: string
  description?: string
  form_data: FormField[]
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface FormResponse {
  id: string
  form_id: string
  response_data: Record<string, any>
  created_at: string
}

export interface UserAnalytics {
  id: string
  user_id: string
  total_forms: number
  total_responses: number
  total_views: number
  last_activity: string
  created_at: string
  updated_at: string
}

export interface FormFile {
  id: string
  form_id: string
  response_id?: string
  field_id: string
  file_name: string
  file_type: string
  file_size: number
  file_url: string
  created_at: string
}

export interface FormField {
  id: string
  type: "text" | "email" | "textarea" | "select" | "radio" | "checkbox" | 
        "number" | "date" | "file" | "image" | "rating" | "location" | 
        "signature" | "audio" | "slider" | "yesno" | "task" | "scanner" | "imageselection"
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  min?: number
  max?: number
  step?: number
  accept?: string // for file types
  multiple?: boolean // for file uploads and selections
  rating_type?: "stars" | "hearts" | "thumbs" | "numbers"
  slider_min?: number
  slider_max?: number
  slider_step?: number
} 