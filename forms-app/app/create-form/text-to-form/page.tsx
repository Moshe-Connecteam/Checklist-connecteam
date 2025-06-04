'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Wand2, Send } from 'lucide-react'

export default function TextToFormPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!user) {
      alert('Please sign in to generate forms!')
      return
    }

    if (!description.trim()) {
      setError('Please enter a description for your form')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/generate-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: description.trim(),
          type: 'text'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate form')
      }

      const { data } = await response.json()
      
      // Navigate to form builder with the generated form data
      const formData = {
        title: data.title,
        description: data.description,
        fields: data.fields
      }
      
      // Store in sessionStorage to pass to builder
      sessionStorage.setItem('aiGeneratedForm', JSON.stringify(formData))
      router.push('/create-form/builder?source=ai-text')

    } catch (error) {
      console.error('Error generating form:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate form')
    } finally {
      setIsGenerating(false)
    }
  }

  const examples = [
    "Create a customer feedback form for a restaurant with ratings, comments, and contact information",
    "Design an event registration form with personal details, dietary restrictions, and payment information",
    "Build a job application form with skills assessment, experience, and document uploads",
    "Make a survey about remote work preferences with multiple choice and scale questions",
    "Create a contact form for a business with service inquiries and appointment booking"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/create-form"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Create Form
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                <Wand2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Text to Form with AI
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Describe your form in plain English and watch AI create a professional form with all the right field types!
            </p>
          </div>
        </div>

        {/* Main Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              {/* Description Input */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  <Sparkles className="inline h-5 w-5 mr-2 text-purple-500" />
                  Describe your form
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Example: Create a customer feedback form for my restaurant. I need ratings for food quality, service, atmosphere, and overall experience. Also include fields for customer contact details, favorite dishes, suggestions for improvement, and whether they would recommend us to others."
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
                  disabled={isGenerating}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">
                    Be specific about the fields you need and their types
                  </span>
                  <span className="text-sm text-gray-500">
                    {description.length}/500
                  </span>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <div className="text-center">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !description.trim() || !isLoaded}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating your form...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Generate Form with AI
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Examples Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Need inspiration? Try these examples:
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="bg-white border border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setDescription(example)}
                >
                  <p className="text-gray-700 text-sm">{example}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              What AI can create for you:
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg mb-3 mx-auto w-fit">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Field Types</h3>
                <p className="text-gray-600 text-sm">
                  AI automatically chooses the best field types: ratings, dropdowns, file uploads, signatures, and more
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg mb-3 mx-auto w-fit">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Instant Creation</h3>
                <p className="text-gray-600 text-sm">
                  Generate complete forms in seconds instead of building field by field manually
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg mb-3 mx-auto w-fit">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Professional Quality</h3>
                <p className="text-gray-600 text-sm">
                  AI creates forms with proper validation, logical flow, and user-friendly design
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 