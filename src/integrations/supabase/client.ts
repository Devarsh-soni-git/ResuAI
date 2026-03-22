import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://fkqpmbducnlvxazfgyra.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrcXBtYmR1Y25sdnhhemZneXJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwOTUwNTUsImV4cCI6MjA4NDY3MTA1NX0.WyRa2QxnO1DnTg3G0dcaNuPmCgXeOn_yUAmm1007BJI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);