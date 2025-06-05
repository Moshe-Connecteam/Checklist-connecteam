-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Forms table
CREATE TABLE forms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Clerk user ID
  title TEXT NOT NULL,
  description TEXT,
  form_data JSONB NOT NULL DEFAULT '{}', -- Form structure and fields
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Form responses table
CREATE TABLE form_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  response_data JSONB NOT NULL DEFAULT '{}', -- User's form answers
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User analytics table
CREATE TABLE user_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE, -- Clerk user ID
  total_forms INTEGER DEFAULT 0,
  total_responses INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_forms_user_id ON forms(user_id);
CREATE INDEX idx_forms_created_at ON forms(created_at);
CREATE INDEX idx_form_responses_form_id ON form_responses(form_id);
CREATE INDEX idx_form_responses_created_at ON form_responses(created_at);
CREATE INDEX idx_user_analytics_user_id ON user_analytics(user_id);

-- Row Level Security (RLS)
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Forms policies
CREATE POLICY "Users can view their own forms" ON forms
  FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert their own forms" ON forms
  FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own forms" ON forms
  FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete their own forms" ON forms
  FOR DELETE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Form responses policies
CREATE POLICY "Users can view responses to their forms" ON form_responses
  FOR SELECT USING (
    form_id IN (
      SELECT id FROM forms WHERE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Anyone can insert form responses" ON form_responses
  FOR INSERT WITH CHECK (true); -- Allow public form submissions

-- User analytics policies
CREATE POLICY "Users can view their own analytics" ON user_analytics
  FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert their own analytics" ON user_analytics
  FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own analytics" ON user_analytics
  FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Functions to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_forms_updated_at BEFORE UPDATE ON forms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_analytics_updated_at BEFORE UPDATE ON user_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 