import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function GET() {
  console.log('🧪 Testing OpenAI connection...')
  
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.log('❌ OpenAI API key not found')
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    console.log('🔑 API key found, testing connection...')

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Say 'Hello FormCraft!' in JSON format like: {\"message\": \"Hello FormCraft!\"}"
        }
      ],
      temperature: 0.1,
      max_tokens: 50
    })

    const response = completion.choices[0]?.message?.content
    console.log('✅ OpenAI test successful:', response)

    return NextResponse.json({
      success: true,
      openaiResponse: response,
      usage: completion.usage,
      model: completion.model
    })

  } catch (error) {
    console.error('💥 OpenAI test failed:', error)
    
    return NextResponse.json(
      { 
        error: 'OpenAI connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 