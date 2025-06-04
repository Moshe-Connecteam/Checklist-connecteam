'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { getUserForm, getFormResponses } from '../../../../lib/database'
import { Form, FormResponse, FormField } from '../../../../lib/supabase'
import { ResponseFieldDisplay } from '../../../../components/ResponseFieldDisplay'
import { generateFormSlug } from '../../../../lib/utils'

export default function FormResponsesPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  
  const [form, setForm] = useState<Form | null>(null)
  const [formFields, setFormFields] = useState<FormField[]>([])
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedResponses, setExpandedResponses] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!isLoaded || !user) {
      setIsLoading(false)
      return
    }

    const loadFormAndResponses = async () => {
      try {
        setIsLoading(true)
        
        console.log('🔍 Loading form with slug:', slug)
        console.log('👤 Current user ID:', user.id)
        
        // Use getUserForm for better performance
        const formData = await getUserForm(slug, user.id)
        
        if (!formData) {
          setError('Form not found')
          return
        }
        
        const responsesData = await getFormResponses(formData.id)
        
        setForm(formData)
        setFormFields(formData.form_data || [])
        setResponses(responsesData)
      } catch (err) {
        console.error('Error loading form and responses:', err)
        setError('Failed to load responses: ' + (err instanceof Error ? err.message : 'Unknown error'))
      } finally {
        setIsLoading(false)
      }
    }

    loadFormAndResponses()
  }, [slug, user, isLoaded])

  const toggleResponseExpansion = (responseId: string) => {
    const newExpanded = new Set(expandedResponses)
    if (newExpanded.has(responseId)) {
      newExpanded.delete(responseId)
    } else {
      newExpanded.add(responseId)
    }
    setExpandedResponses(newExpanded)
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please sign in to view responses.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading responses...</p>
        </div>
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Form not found'}</p>
          <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const formSlug = generateFormSlug(form.title, form.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  ← Back to Dashboard
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mt-4">Form Responses</h1>
              <p className="text-gray-600">{form.title}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{responses.length}</p>
              <p className="text-gray-600">Total Responses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {responses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No responses yet</h3>
            <p className="text-gray-600 mb-4">Share your form to start collecting responses!</p>
            <div className="flex justify-center space-x-4">
              <Link
                href={`/forms/${formSlug}`}
                target="_blank"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Preview Form
              </Link>
              <button
                onClick={() => {
                  const link = `${window.location.origin}/forms/${formSlug}`
                  navigator.clipboard.writeText(link)
                  alert('📋 Shareable link copied to clipboard!')
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                Copy Share Link
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Responses ({responses.length})</h2>
              <div className="flex space-x-2">
                <Link
                  href={`/forms/${formSlug}`}
                  target="_blank"
                  className="bg-green-100 text-green-700 px-3 py-2 rounded-md hover:bg-green-200 text-sm"
                >
                  Preview Form
                </Link>
                <button
                  onClick={() => {
                    const link = `${window.location.origin}/forms/${formSlug}`
                    navigator.clipboard.writeText(link)
                    alert('📋 Shareable link copied to clipboard!')
                  }}
                  className="bg-purple-100 text-purple-700 px-3 py-2 rounded-md hover:bg-purple-200 text-sm"
                >
                  Copy Share Link
                </button>
              </div>
            </div>
            {responses.map((response, index) => (
              <div key={response.id} className="bg-white rounded-lg shadow border border-gray-200">
                {/* Response Header */}
                <div 
                  className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleResponseExpansion(response.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                        Response #{responses.length - index}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(response.created_at).toLocaleDateString()} at {new Date(response.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg 
                        className={`w-5 h-5 transform transition-transform ${
                          expandedResponses.has(response.id) ? 'rotate-180' : ''
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Response Details */}
                {expandedResponses.has(response.id) && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="space-y-4">
                      {formFields.map((field) => (
                        <div key={field.id} className="bg-white p-4 rounded-lg border">
                          <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <div className="text-sm sm:text-base">
                              <ResponseFieldDisplay 
                                field={field} 
                                value={response.response_data[field.id]} 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 