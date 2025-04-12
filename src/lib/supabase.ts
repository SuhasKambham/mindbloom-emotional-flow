
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { supabase as integrationSupabase } from '@/integrations/supabase/client';

// Re-export the supabase client from the integration
export const supabase = integrationSupabase;

export type Tables = Database['public']['Tables'];
export type JournalEntry = Tables['journal_entries']['Row'];
export type MoodType = Tables['mood_types']['Row'];
export type GoalType = Tables['goals']['Row'];
export type CycleData = Tables['cycle_tracking']['Row'];
export type PrivateEntry = Tables['private_entries']['Row'];
