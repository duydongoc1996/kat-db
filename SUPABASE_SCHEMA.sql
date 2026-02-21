-- Kat's Baby Tracking App - Database Schema with Authentication
-- Run this SQL in your Supabase SQL Editor

-- Create the metrics table
CREATE TABLE IF NOT EXISTS metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  input_type VARCHAR(50) NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  note TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_metrics_user_id ON metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_metrics_input_type ON metrics(input_type);
CREATE INDEX IF NOT EXISTS idx_metrics_recorded_at ON metrics(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_user_type ON metrics(user_id, input_type);

-- Enable Row Level Security (RLS)
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- Drop old policy if exists
DROP POLICY IF EXISTS "Allow all operations on metrics" ON metrics;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view own metrics" ON metrics
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own metrics" ON metrics
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own metrics" ON metrics
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own metrics" ON metrics
  FOR DELETE
  USING (auth.uid() = user_id);

-- Sample metric types (for reference):
-- milk_produced: Milk produced by mom (ml)
-- milk_consumed: Milk consumed by Kat (ml)
-- weight: Kat's weight (grams)
-- diaper_wet: Number of wet diapers
-- diaper_dirty: Number of dirty diapers
-- sleep_duration: Sleep duration (minutes)
-- feeding_duration: Feeding duration (minutes)
-- temperature: Body temperature (Celsius)
-- formula: Formula consumed (ml)

-- Note: To restrict access to specific Gmail accounts only:
-- 1. Enable Google OAuth in Supabase Dashboard → Authentication → Providers
-- 2. Use this approach in your app's Auth flow:
--    - Allow any Google login initially
--    - Check user's email against a whitelist in your app code
--    - Or create a separate 'allowed_users' table and check against it
