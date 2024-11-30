import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://xynqqakrebmhwkahvlgp.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5bnFxYWtyZWJtaHdrYWh2bGdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MDg0MDMsImV4cCI6MjA0ODI4NDQwM30.sCdSQcWi9g7nGQlyNhzmqCg-okoz2itzGOoDYNMMLO8"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage
  }
})