import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import { generateFormSlug, extractIdFromSlug } from '../../../../lib/utils'

export async function GET() {
  try {
    const { data: forms, error } = await supabase
      .from('forms')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const formSummary = forms?.map(form => ({
      id: form.id,
      fullId: form.id, // Show full UUID
      title: form.title,
      slug: generateFormSlug(form.title, form.id),
      userId: form.user_id,
      created: form.created_at
    }))

    // Test slug extraction with the new format
    const testSlug = 'job-application-form-28b8880c-daa3-4733-9005-58e3b3ee9987'
    const extractedId = extractIdFromSlug(testSlug)
    const matchingForm = forms?.find(f => f.id === extractedId)

    return NextResponse.json({
      totalForms: forms?.length || 0,
      forms: formSummary,
      testSlugExtraction: {
        slug: testSlug,
        extractedId,
        matchingForm: matchingForm ? {
          id: matchingForm.id,
          fullId: matchingForm.id,
          title: matchingForm.title,
          slug: generateFormSlug(matchingForm.title, matchingForm.id),
          userId: matchingForm.user_id,
          created: matchingForm.created_at
        } : null
      }
    })
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 