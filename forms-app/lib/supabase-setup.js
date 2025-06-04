const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupSupabaseStorage() {
  try {
    console.log('🚀 Setting up Supabase Storage...')
    
    // Create storage bucket
    const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('form-files', {
      public: false,
      allowedMimeTypes: ['image/*', 'audio/*', 'video/*', 'application/*', 'text/*'],
      fileSizeLimit: '50MB',
    })
    
    if (bucketError && !bucketError.message.includes('already exists')) {
      console.error('❌ Error creating bucket:', bucketError.message)
    } else {
      console.log('✅ Storage bucket "form-files" created successfully!')
    }
    
    // Run database migration
    console.log('📊 Running database migration...')
    
    const migrationSQL = `
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

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_form_files_form_id ON form_files(form_id);
      CREATE INDEX IF NOT EXISTS idx_form_files_response_id ON form_files(response_id);
      CREATE INDEX IF NOT EXISTS idx_form_files_field_id ON form_files(field_id);
    `
    
    const { error: migrationError } = await supabase.rpc('exec_sql', { sql: migrationSQL })
    
    if (migrationError) {
      console.error('❌ Migration error:', migrationError.message)
    } else {
      console.log('✅ Database migration completed successfully!')
    }
    
    console.log('🎉 Supabase setup completed!')
    console.log('')
    console.log('📝 Next steps:')
    console.log('1. You can now use advanced field types in your forms')
    console.log('2. File uploads will be stored in the "form-files" bucket')
    console.log('3. Check your Supabase dashboard to configure RLS policies if needed')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupSupabaseStorage()
}

module.exports = { setupSupabaseStorage } 