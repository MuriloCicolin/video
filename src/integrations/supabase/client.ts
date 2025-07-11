import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = "https://tbthhpcohvzughzgomtj.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGhocGNvaHZ6dWdoemdvbXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTIwMzMsImV4cCI6MjA2Nzc2ODAzM30.6KsbJcasVpyvimihVruE0PJmrX4GA4LJSoffmnd7Fls"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)