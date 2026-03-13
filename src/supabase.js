import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kmurovpjsuavlnnvnozw.supabase.co'
const supabaseKey = 'sb_publishable_7M1CR7_rlTW9WlvXw3brag_XImqyPNn'

export const supabase = createClient(supabaseUrl, supabaseKey)