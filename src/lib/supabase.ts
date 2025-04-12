
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials. Please connect to Supabase in the Lovable interface.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export type Tables = Database['public']['Tables'];
export type JournalEntry = Tables['journal_entries']['Row'];
export type MoodType = Tables['mood_types']['Row'];
export type GoalType = Tables['goals']['Row'];
export type CycleData = Tables['cycle_tracking']['Row'];
