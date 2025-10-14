import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xfhkjhilcvnpdemyelim.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmaGtqaGlsY3ZucGRlbXllbGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MjcwOTksImV4cCI6MjA3NjAwMzA5OX0.H91JDhJhZrZPRjXz_iPlima3Ie2ELvUS4JRBr9JvuZ8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)