import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { supabase } from '../../../../lib/supabase'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    // First, verify the user owns this form
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('id, user_id')
      .eq('id', id)
      .single()

    if (formError || !form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      )
    }

    if (form.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - you can only delete your own forms' },
        { status: 403 }
      )
    }

    // Delete in the correct order due to foreign key constraints:
    // 1. Delete form_files (if any)
    // 2. Delete form_responses 
    // 3. Delete the form itself

    // Delete associated files
    const { error: filesError } = await supabase
      .from('form_files')
      .delete()
      .eq('form_id', id)

    if (filesError) {
      console.error('Error deleting form files:', filesError)
      // Don't fail the whole operation for file deletion errors
    }

    // Delete form responses
    const { error: responsesError } = await supabase
      .from('form_responses')
      .delete()
      .eq('form_id', id)

    if (responsesError) {
      console.error('Error deleting form responses:', responsesError)
      return NextResponse.json(
        { error: 'Failed to delete form responses' },
        { status: 500 }
      )
    }

    // Finally, delete the form
    const { error: deleteError } = await supabase
      .from('forms')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting form:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete form' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Form and all associated data deleted successfully'
    })

  } catch (error) {
    console.error('Error in DELETE /api/forms/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 