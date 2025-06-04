import { NextRequest, NextResponse } from 'next/server'
import { generateForm, AIFormRequest } from '../../../../lib/ai-service'

export async function POST(request: NextRequest) {
  console.log('🚀 AI Generate Form API called')
  
  try {
    const body: AIFormRequest = await request.json()
    console.log('📝 Request body:', { 
      description: body.description?.substring(0, 100) + '...', 
      type: body.type,
      hasImage: !!body.imageBase64 
    })
    
    // Validate the request
    if (!body.description || !body.type) {
      console.log('❌ Validation failed: Missing description or type')
      return NextResponse.json(
        { error: 'Description and type are required' },
        { status: 400 }
      )
    }

    if (body.type === 'image' && !body.imageBase64) {
      console.log('❌ Validation failed: Missing image data')
      return NextResponse.json(
        { error: 'Image data is required for image-based generation' },
        { status: 400 }
      )
    }

    console.log('✅ Validation passed, calling AI service...')
    
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.log('❌ OpenAI API key not found in environment')
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Generate the form using AI
    const generatedForm = await generateForm(body)
    console.log('✅ AI generation successful:', { 
      title: generatedForm.title, 
      fieldCount: generatedForm.fields?.length || 0 
    })

    return NextResponse.json({
      success: true,
      data: generatedForm
    })

  } catch (error) {
    console.error('💥 AI form generation error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json(
      { 
        error: 'Failed to generate form with AI',
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : 'UnknownError'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI form generation endpoint. Use POST with description and type.',
    supportedTypes: ['text', 'image'],
    example: {
      description: 'Create a customer feedback form for a restaurant',
      type: 'text'
    }
  })
} 