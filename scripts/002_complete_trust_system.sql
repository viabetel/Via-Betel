-- Via Betel Trust System - Complete Schema with RLS
-- Execute this in Supabase SQL Editor

-- Drop existing tables if needed (careful in production!)
-- DROP TABLE IF EXISTS messages CASCADE;
-- DROP TABLE IF EXISTS threads CASCADE;
-- DROP TABLE IF EXISTS lead_events CASCADE;
-- DROP TABLE IF EXISTS leads CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('STUDENT', 'INSTRUCTOR', 'ADMIN')),
  phone TEXT,
  city TEXT,
  state TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Anyone can insert their own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Leads table (budget requests with status tracking)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  instructor_slug TEXT, -- instructor chosen by student
  city TEXT NOT NULL,
  neighborhood TEXT,
  category TEXT NOT NULL, -- CNH category (A, B, C, D, E, AB)
  availability1 TEXT NOT NULL,
  availability2 TEXT,
  availability3 TEXT,
  objective TEXT,
  notes TEXT,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'DELIVERED', 'VIEWED', 'RESPONDED', 'CLOSED', 'CANCELLED')),
  
  -- Timestamps for each status
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads
CREATE POLICY "Students can view their own leads" 
  ON leads FOR SELECT 
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own leads" 
  ON leads FOR INSERT 
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own leads" 
  ON leads FOR UPDATE 
  USING (auth.uid() = student_id);

-- Threads table (chat conversations between student and instructor)
CREATE TABLE IF NOT EXISTS threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Read receipts
  student_last_read_at TIMESTAMPTZ,
  instructor_last_read_at TIMESTAMPTZ,
  
  -- Last message preview
  last_message_text TEXT,
  last_message_at TIMESTAMPTZ,
  last_message_from UUID REFERENCES profiles(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on threads
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for threads
CREATE POLICY "Users can view threads they're part of" 
  ON threads FOR SELECT 
  USING (auth.uid() = student_id OR auth.uid() = instructor_id);

CREATE POLICY "System can insert threads" 
  ON threads FOR INSERT 
  WITH CHECK (true); -- Controlled by API

CREATE POLICY "Participants can update threads" 
  ON threads FOR UPDATE 
  USING (auth.uid() = student_id OR auth.uid() = instructor_id);

-- Messages table (actual chat messages with anti-bypass)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  from_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  
  -- Anti-bypass tracking
  is_flagged BOOLEAN DEFAULT FALSE,
  flag_reason TEXT,
  
  -- Read receipt
  read_at TIMESTAMPTZ,
  
  -- System message flag
  is_system BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages
CREATE POLICY "Users can view messages from their threads" 
  ON messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM threads 
      WHERE threads.id = messages.thread_id 
      AND (threads.student_id = auth.uid() OR threads.instructor_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert messages to their threads" 
  ON messages FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM threads 
      WHERE threads.id = messages.thread_id 
      AND (threads.student_id = auth.uid() OR threads.instructor_id = auth.uid())
    )
  );

CREATE POLICY "Users can update their own messages" 
  ON messages FOR UPDATE 
  USING (auth.uid() = from_id);

-- Lead events table (timeline/activity log)
CREATE TABLE IF NOT EXISTS lead_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'STATUS_CHANGE', 'MESSAGE_SENT', 'VIEWED', 'RESPONDED'
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on lead_events
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lead_events
CREATE POLICY "Users can view events for their leads" 
  ON lead_events FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM leads 
      WHERE leads.id = lead_events.lead_id 
      AND leads.student_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_student_id ON leads(student_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_threads_student_id ON threads(student_id);
CREATE INDEX IF NOT EXISTS idx_threads_instructor_id ON threads(instructor_id);
CREATE INDEX IF NOT EXISTS idx_threads_lead_id ON threads(lead_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_events_lead_id ON lead_events(lead_id);

-- Functions to auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_threads_updated_at BEFORE UPDATE ON threads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get unread message count
CREATE OR REPLACE FUNCTION get_unread_count(user_uuid UUID)
RETURNS TABLE(thread_id UUID, unread_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.thread_id,
    COUNT(*) as unread_count
  FROM messages m
  INNER JOIN threads t ON m.thread_id = t.id
  WHERE 
    m.from_id != user_uuid
    AND (
      (t.student_id = user_uuid AND (m.created_at > t.student_last_read_at OR t.student_last_read_at IS NULL))
      OR
      (t.instructor_id = user_uuid AND (m.created_at > t.instructor_last_read_at OR t.instructor_last_read_at IS NULL))
    )
  GROUP BY m.thread_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE threads;
ALTER PUBLICATION supabase_realtime ADD TABLE leads;

-- Success message
SELECT 'Via Betel Trust System schema created successfully!' as message;
