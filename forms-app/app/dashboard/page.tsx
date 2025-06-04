"use client"

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getUserForms, getUserAnalytics, refreshUserAnalytics, getFormResponses, deleteForm as deleteFormDB } from '../../lib/database'
import { Form, UserAnalytics } from '../../lib/supabase'
import { testSupabaseConnection, checkEnvironmentVariables } from '../../lib/test-connection'
import { generateFormSlug } from '../../lib/utils'

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const [forms, setForms] = useState<Form[]>([])
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [responseCounts, setResponseCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    if (isLoaded && user) {
      loadDashboardData()
    }
  }, [isLoaded, user])

  const loadDashboardData = async () => {
    if (!user) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Loading dashboard data for user:', user.id)
      
      // Check environment variables
      if (!checkEnvironmentVariables()) {
        throw new Error('Missing Supabase environment variables')
      }
      
      // Test Supabase connection
      const connectionTest = await testSupabaseConnection()
      if (!connectionTest.success) {
        const errorMsg = connectionTest.error instanceof Error ? connectionTest.error.message : 'Unknown connection error'
        throw new Error(`Supabase connection failed: ${errorMsg}`)
      }
      
      // Load user forms and analytics in parallel
      const [userForms, userAnalytics] = await Promise.all([
        getUserForms(user.id),
        getUserAnalytics(user.id)
      ])
      
      console.log('User forms:', userForms)
      console.log('User analytics:', userAnalytics)
      
      setForms(userForms)
      
      // Load response counts for each form
      const counts: Record<string, number> = {}
      await Promise.all(
        userForms.map(async (form) => {
          try {
            const responses = await getFormResponses(form.id)
            counts[form.id] = responses.length
          } catch (err) {
            console.error(`Error loading responses for form ${form.id}:`, err)
            counts[form.id] = 0
          }
        })
      )
      setResponseCounts(counts)
      
      // Always refresh analytics to get current counts
      const refreshedAnalytics = await refreshUserAnalytics(user.id)
      console.log('Refreshed analytics:', refreshedAnalytics)
      setAnalytics(refreshedAnalytics)
    } catch (err) {
      console.error('Error loading dashboard data:', err)
      console.error('Error details:', JSON.stringify(err, null, 2))
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(`Failed to load dashboard data: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  const copyShareableLink = (formId: string, formTitle: string) => {
    const slug = generateFormSlug(formTitle, formId)
    const link = `${window.location.origin}/forms/${slug}`
    navigator.clipboard.writeText(link)
    alert("📋 Shareable link copied to clipboard!")
  }

  const deleteForm = async (formId: string, formTitle: string) => {
    if (confirm(`Are you sure you want to delete "${formTitle}"? This action cannot be undone.`)) {
      try {
        await deleteFormDB(formId)
        alert('✅ Form deleted successfully!')
        loadDashboardData() // Refresh the data
      } catch (error) {
        console.error('Delete error:', error)
        alert('❌ Failed to delete form. Please try again.')
      }
    }
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
          <p className="text-gray-600">Please sign in to access your dashboard.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
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
          <button 
            onClick={loadDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.firstName || user.emailAddresses[0]?.emailAddress}!</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/responses"
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                View All Responses
              </Link>
              <Link
                href="/create-form"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Your First Form
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Forms</h3>
                <p className="text-3xl font-bold text-blue-600">{analytics?.total_forms || 0}</p>
              </div>
            </div>
          </div>

          <Link href="/responses" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Responses</h3>
                <p className="text-3xl font-bold text-green-600">{analytics?.total_responses || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Click to view all →</p>
              </div>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Views</h3>
                <p className="text-3xl font-bold text-purple-600">{analytics?.total_views || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Forms */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Forms</h2>
          </div>
          <div className="p-6">
            {forms.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
                <p className="text-gray-600 mb-4">Get started by creating your first form.</p>
                <Link
                  href="/create-form"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Your First Form
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {forms.map((form) => (
                  <div key={form.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{form.title}</h3>
                        {form.description && (
                          <p className="text-gray-600 mt-1 text-sm sm:text-base line-clamp-2">{form.description}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-xs sm:text-sm text-gray-500">
                          <span>Created {new Date(form.created_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{responseCounts[form.id] || 0} responses</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            form.is_published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {form.is_published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:ml-4">
                        <Link
                          href={`/forms/${generateFormSlug(form.title, form.id)}`}
                          target="_blank"
                          className="bg-green-100 text-green-700 px-3 py-2 rounded-md hover:bg-green-200 transition-colors text-center text-xs sm:text-sm"
                        >
                          Preview
                        </Link>
                        <button
                          onClick={() => copyShareableLink(form.id, form.title)}
                          className="bg-purple-100 text-purple-700 px-3 py-2 rounded-md hover:bg-purple-200 transition-colors text-center text-xs sm:text-sm"
                        >
                          Copy Link
                        </button>
                        <Link
                          href={`/builder?edit=${form.id}`}
                          className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors text-center text-xs sm:text-sm"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/forms/${generateFormSlug(form.title, form.id)}/responses`}
                          className="bg-blue-100 text-blue-700 px-3 py-2 rounded-md hover:bg-blue-200 transition-colors text-center text-xs sm:text-sm"
                        >
                          Responses
                        </Link>
                        <button
                          onClick={() => deleteForm(form.id, form.title)}
                          className="bg-red-100 text-red-700 px-3 py-2 rounded-md hover:bg-red-200 transition-colors text-center text-xs sm:text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
