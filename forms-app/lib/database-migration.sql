-- Migration to add form_files table for file uploads
CREATE TABLE IF NOT EXISTS form_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  response_id UUID REFERENCES form_responses(id) ON DELETE CASCADE,
  field_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for form_files
ALTER TABLE form_files ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access files from their own forms
CREATE POLICY "Users can access their own form files" ON form_files
  FOR ALL USING (
    form_id IN (
      SELECT id FROM forms WHERE user_id = auth.uid()
    )
  );

-- Policy: Anyone can upload files to published forms (for form submissions)
CREATE POLICY "Anyone can upload to published forms" ON form_files
  FOR INSERT WITH CHECK (
    form_id IN (
      SELECT id FROM forms WHERE is_published = true
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_form_files_form_id ON form_files(form_id);
CREATE INDEX IF NOT EXISTS idx_form_files_response_id ON form_files(response_id);
CREATE INDEX IF NOT EXISTS idx_form_files_field_id ON form_files(field_id); 