'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { getUserForm, getFormResponses } from '../../lib/database'
import { Form, FormResponse, FormField } from '../../lib/supabase'
import { ResponseFieldDisplay } from '../../components/ResponseFieldDisplay'

function FormResponsesContent() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get form identifier from query params
  const formId = searchParams.get('id') || searchParams.get('form') || ''
  
  const [form, setForm] = useState<Form | null>(null)
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadFormAndResponses = async () => {
      if (!isLoaded || !user || !formId) {
        if (isLoaded && !user) {
          router.push('/sign-in')
        }
        return
      }

      try {
        setIsLoading(true)
        console.log('🔍 Loading form and responses for ID:', formId)
        
        // Load form (verify ownership)
        const formData = await getUserForm(formId, user.id)
        console.log('✅ Form loaded:', formData.title)
        setForm(formData)

        // Load responses
        const responsesData = await getFormResponses(formData.id)
        console.log('✅ Responses loaded:', responsesData.length)
        setResponses(responsesData)
        
      } catch (err) {
        console.error('❌ Error loading form/responses:', err)
        setError('Form not found or you do not have permission to view it')
      } finally {
        setIsLoading(false)
      }
    }

    loadFormAndResponses()
  }, [isLoaded, user, formId, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!form) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
              <p className="mt-2 text-gray-600">
                {responses.length} response{responses.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                href={`/view?id=${form.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                View Form
              </Link>
              <Link
                href={`/builder?edit=${form.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Edit Form
              </Link>
            </div>
          </div>
        </div>

        {/* Share URL */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Share this form</h3>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/view?id=${form.id}`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/view?id=${form.id}`)
                // You could add a toast notification here
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Responses */}
        {responses.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No responses yet</h3>
              <p className="text-gray-600 mb-6">Share your form to start collecting responses.</p>
              <Link
                href={`/view?id=${form.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Preview Form
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {responses.map((response, index) => (
              <div key={response.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Response #{responses.length - index}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(response.created_at).toLocaleString()}
                  </p>
                </div>
                
                <div className="grid gap-6">
                  {form.form_data.map((field: FormField) => {
                    const value = response.response_data[field.id]
                    if (value === undefined || value === null || value === '') return null
                    
                    return (
                      <ResponseFieldDisplay
                        key={field.id}
                        field={field}
                        value={value}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function FormResponsesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <FormResponsesContent />
    </Suspense>
  )
} 