import { supabase, Form, FormResponse, UserAnalytics, FormFile } from './supabase'
import { isValidUUID, getSearchPatternFromSlug, extractIdFromSlug } from './utils'

// Forms CRUD operations
export const createForm = async (userId: string, title: string, description: string = '', formData: any = {}) => {
  const { data, error } = await supabase
    .from('forms')
    .insert({
      user_id: userId,
      title,
      description,
      form_data: formData,
      is_published: true
    })
    .select()
    .single()

  if (error) throw error
  return data as Form
}

export const getUserForms = async (userId: string) => {
  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Form[]
}

// Get form by ID or slug
export async function getForm(identifier: string): Promise<Form> {
  console.log('🔍 Getting form for identifier:', identifier)
  let data, error

  if (isValidUUID(identifier)) {
    console.log('📋 Searching by UUID:', identifier)
    const result = await supabase
      .from('forms')
      .select('*')
      .eq('id', identifier)
      .single()
    data = result.data
    error = result.error
  } else {
    console.log('🔗 Searching by slug:', identifier)
    // Extract full UUID from slug
    const extractedId = extractIdFromSlug(identifier)
    console.log('🔍 Extracted ID from slug:', extractedId)
    
    if (!extractedId) {
      throw new Error('Invalid slug format')
    }

    // Search by the extracted UUID directly
    const result = await supabase
      .from('forms')
      .select('*')
      .eq('id', extractedId)
      .single()
    
    if (result.error) {
      error = result.error
      data = null
    } else {
      data = result.data
      error = null
    }
  }

  if (error) {
    console.error('❌ Error fetching form:', error)
    throw new Error(`Failed to fetch form: ${error.message}`)
  }

  if (!data) {
    console.error('❌ Form not found for identifier:', identifier)
    throw new Error('Form not found')
  }

  console.log('✅ Form found:', data.title)
  return data
}

// Get form by ID or slug for a specific user (more efficient)
export async function getUserForm(identifier: string, userId: string): Promise<Form> {
  console.log('🔍 Getting user form for identifier:', identifier, 'user:', userId)
  let data, error

  if (isValidUUID(identifier)) {
    console.log('📋 Searching by UUID:', identifier)
    const result = await supabase
      .from('forms')
      .select('*')
      .eq('id', identifier)
      .eq('user_id', userId)
      .single()
    data = result.data
    error = result.error
  } else {
    console.log('🔗 Searching by slug:', identifier)
    // Extract full UUID from slug
    const extractedId = extractIdFromSlug(identifier)
    console.log('🔍 Extracted ID from slug:', extractedId)
    
    if (!extractedId) {
      console.error('❌ Could not extract ID from slug:', identifier)
      throw new Error(`Invalid slug format: "${identifier}". Expected format: "title-UUID".`)
    }
    
    // Search by the extracted UUID and user ID directly
    const result = await supabase
      .from('forms')
      .select('*')
      .eq('id', extractedId)
      .eq('user_id', userId)
      .single()
    
    if (result.error) {
      error = result.error
      data = null
    } else {
      data = result.data
      error = null
      console.log('✅ Found matching form:', data.title, data.id)
    }
  }

  if (error) {
    console.error('❌ Error fetching user form:', error)
    throw new Error(`Failed to fetch form: ${error.message}`)
  }

  if (!data) {
    console.error('❌ User form not found for identifier:', identifier)
    throw new Error('Form not found')
  }

  console.log('✅ User form found:', data.title)
  return data
}

export const getPublishedForm = async (formId: string) => {
  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('id', formId)
    .eq('is_published', true)
    .single()

  if (error) throw error
  return data as Form
}

export const updateForm = async (formId: string, updates: Partial<Form>) => {
  const { data, error } = await supabase
    .from('forms')
    .update(updates)
    .eq('id', formId)
    .select()
    .single()

  if (error) throw error
  return data as Form
}

export const deleteForm = async (formId: string) => {
  const { error } = await supabase
    .from('forms')
    .delete()
    .eq('id', formId)

  if (error) throw error
}

// Form responses operations
export const submitFormResponse = async (formId: string, responseData: any) => {
  const { data, error } = await supabase
    .from('form_responses')
    .insert({
      form_id: formId,
      response_data: responseData,
    })
    .select()
    .single()

  if (error) throw error
  return data as FormResponse
}

export const getFormResponses = async (formId: string) => {
  const { data, error } = await supabase
    .from('form_responses')
    .select('*')
    .eq('form_id', formId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as FormResponse[]
}

// User analytics operations
export const getUserAnalytics = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_analytics')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    throw error
  }
  
  return data as UserAnalytics | null
}

export const createOrUpdateUserAnalytics = async (userId: string, updates: Partial<UserAnalytics>) => {
  // First try to update
  const { data: existingData } = await supabase
    .from('user_analytics')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (existingData) {
    // Update existing record
    const { data, error } = await supabase
      .from('user_analytics')
      .update({ ...updates, last_activity: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data as UserAnalytics
  } else {
    // Create new record
    const { data, error } = await supabase
      .from('user_analytics')
      .insert({
        user_id: userId,
        total_forms: 0,
        total_responses: 0,
        total_views: 0,
        ...updates,
      })
      .select()
      .single()

    if (error) throw error
    return data as UserAnalytics
  }
}

// Helper function to refresh user analytics
export const refreshUserAnalytics = async (userId: string) => {
  // Get user's forms count
  const { count: formsCount } = await supabase
    .from('forms')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Get user's total responses count
  const { count: responsesCount } = await supabase
    .from('form_responses')
    .select('*, forms!inner(*)', { count: 'exact', head: true })
    .eq('forms.user_id', userId)

  // Update analytics
  return await createOrUpdateUserAnalytics(userId, {
    total_forms: formsCount || 0,
    total_responses: responsesCount || 0,
  })
}

// File upload functions
export async function uploadFile(
  file: File,
  formId: string,
  fieldId: string,
  responseId?: string
): Promise<FormFile> {
  try {
    // Check if storage bucket exists first
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.log('Storage not available, using fallback method')
      // Fallback: convert file to base64 and store inline
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64Data = reader.result as string
          resolve({
            id: `fallback-${Date.now()}`,
            form_id: formId,
            response_id: responseId || undefined,
            field_id: fieldId,
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            file_url: base64Data,
            created_at: new Date().toISOString()
          })
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      })
    }

    const bucketExists = buckets?.some(bucket => bucket.name === 'form-files')
    
    if (!bucketExists) {
      // Try to create the bucket
      const { error: createError } = await supabase.storage.createBucket('form-files', {
        public: false,
        allowedMimeTypes: ['image/*', 'audio/*', 'video/*', 'application/*', 'text/*']
      })
      
      if (createError) {
        console.log('Cannot create storage bucket, using fallback method')
        // Fallback: convert file to base64 and store inline
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            const base64Data = reader.result as string
            resolve({
              id: `fallback-${Date.now()}`,
              form_id: formId,
              response_id: responseId || undefined,
              field_id: fieldId,
              file_name: file.name,
              file_type: file.type,
              file_size: file.size,
              file_url: base64Data,
              created_at: new Date().toISOString()
            })
          }
          reader.onerror = () => reject(new Error('Failed to read file'))
          reader.readAsDataURL(file)
        })
      }
    }

    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `forms/${formId}/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('form-files')
      .upload(filePath, file)

    if (uploadError) {
      console.log('Storage upload failed, using fallback method')
      // Fallback: convert file to base64 and store inline
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64Data = reader.result as string
          resolve({
            id: `fallback-${Date.now()}`,
            form_id: formId,
            response_id: responseId || undefined,
            field_id: fieldId,
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            file_url: base64Data,
            created_at: new Date().toISOString()
          })
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('form-files')
      .getPublicUrl(filePath)

    // Try to save file metadata to database (optional)
    try {
      const { data, error } = await supabase
        .from('form_files')
        .insert({
          form_id: formId,
          response_id: responseId || null,
          field_id: fieldId,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_url: urlData.publicUrl
        })
        .select()
        .single()

      if (error) {
        console.log('Database insert failed, returning file info without DB record')
      }
      
      return data || {
        id: `storage-${Date.now()}`,
        form_id: formId,
        response_id: responseId || undefined,
        field_id: fieldId,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_url: urlData.publicUrl,
        created_at: new Date().toISOString()
      }
    } catch (dbError) {
      // Return file info even if DB insert fails
      return {
        id: `storage-${Date.now()}`,
        form_id: formId,
        response_id: responseId || undefined,
        field_id: fieldId,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_url: urlData.publicUrl,
        created_at: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error('Failed to upload file. Please try again.')
  }
}

export async function getFormFiles(formId: string): Promise<FormFile[]> {
  try {
    const { data, error } = await supabase
      .from('form_files')
      .select('*')
      .eq('form_id', formId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching form files:', error)
    throw error
  }
}

export async function deleteFile(fileId: string): Promise<void> {
  try {
    // Get file info first
    const { data: fileData, error: fetchError } = await supabase
      .from('form_files')
      .select('file_url')
      .eq('id', fileId)
      .single()

    if (fetchError) throw fetchError

    // Extract file path from URL
    const urlParts = fileData.file_url.split('/')
    const filePath = urlParts.slice(-3).join('/') // forms/formId/filename

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('form-files')
      .remove([filePath])

    if (storageError) throw storageError

    // Delete from database
    const { error: dbError } = await supabase
      .from('form_files')
      .delete()
      .eq('id', fileId)

    if (dbError) throw dbError
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
} 