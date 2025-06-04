'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { getUserForms, getFormResponses } from '../../lib/database'
import { generateFormSlug } from '../../lib/utils'
import { Form, FormResponse, FormField } from '../../lib/supabase'
import { ResponseFieldDisplay } from '../../components/ResponseFieldDisplay'

interface ResponseWithForm extends FormResponse {
  form_title: string
  form_fields: FormField[]
}

export default function AllResponsesPage() {
  const { user, isLoaded } = useUser()
  const [responses, setResponses] = useState<ResponseWithForm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedResponses, setExpandedResponses] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadAllResponses = async () => {
      if (!user || !isLoaded) return
      
      try {
        // Get all user forms
        const userForms = await getUserForms(user.id)
        
        // Get all responses for all forms
        const allResponses: ResponseWithForm[] = []
        
        await Promise.all(
          userForms.map(async (form) => {
            try {
              const formResponses = await getFormResponses(form.id)
              const responsesWithForm = formResponses.map(response => ({
                ...response,
                form_title: form.title,
                form_fields: form.form_data || []
              }))
              allResponses.push(...responsesWithForm)
            } catch (err) {
              console.error(`Error loading responses for form ${form.id}:`, err)
            }
          })
        )
        
        // Sort by creation date (newest first)
        allResponses.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        
        setResponses(allResponses)
      } catch (err) {
        console.error('Error loading all responses:', err)
        setError('Failed to load responses')
      } finally {
        setIsLoading(false)
      }
    }

    loadAllResponses()
  }, [user, isLoaded])

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
          <p className="mt-4 text-gray-600">Loading all responses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="space-y-4">
            <div>
              <Link
                href="/dashboard"
                className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors mb-4 inline-block"
              >
                ← Back to Dashboard
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Responses</h1>
                <p className="text-gray-600 mt-1">View all responses from all your forms</p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-2xl font-bold text-blue-600">{responses.length}</p>
                <p className="text-gray-600 text-sm">Total Responses</p>
              </div>
            </div>
          </div>
        </div>

        {responses.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No responses yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">Start sharing your forms to collect responses!</p>
            <Link
              href="/create-form"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 inline-block transition-colors"
            >
              Create New Form
            </Link>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Responses ({responses.length})</h2>
            </div>
            {responses.map((response, index) => (
              <div key={response.id} className="bg-white rounded-lg shadow border border-gray-200">
                {/* Response Header */}
                <div 
                  className="px-4 sm:px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleResponseExpansion(response.id)}
                >
                  <div className="space-y-3">
                    {/* Response Number and Form Title */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                          Response #{responses.length - index}
                        </div>
                        <h3 className="text-base font-medium text-gray-900 line-clamp-1">{response.form_title}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/forms/${generateFormSlug(response.form_title, response.form_id)}/responses`}
                          className="text-xs text-purple-600 hover:text-purple-700 px-2 py-1 bg-purple-50 rounded whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Form Responses
                        </Link>
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
                    
                    {/* Submission Date and Time */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="font-medium">Submitted:</span>
                        <span className="ml-1">{new Date(response.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Time:</span>
                        <span className="ml-1">{new Date(response.created_at).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response Details */}
                {expandedResponses.has(response.id) && (
                  <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="space-y-4">
                      {response.form_fields.map((field) => (
                        <div key={field.id} className="bg-white p-3 sm:p-4 rounded-lg border">
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