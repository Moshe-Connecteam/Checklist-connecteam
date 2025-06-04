import { supabase } from './supabase'

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase.from('forms').select('count').limit(1)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return { success: false, error }
    }
    
    console.log('Supabase connection successful!')
    return { success: true, data }
  } catch (err) {
    console.error('Connection test failed:', err)
    return { success: false, error: err }
  }
}

export const checkEnvironmentVariables = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('Environment variables check:')
  console.log('SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
  console.log('SUPABASE_KEY:', supabaseKey ? '✅ Set' : '❌ Missing')
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing environment variables!')
    return false
  }
  
  return true
} 