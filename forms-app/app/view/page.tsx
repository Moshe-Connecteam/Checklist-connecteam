'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { getForm, submitFormResponse, uploadFile } from '../../lib/database'
import { AdvancedFormField } from '../../components/AdvancedFormFields'
import type { Form, FormField } from '../../lib/supabase'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { ArrowLeft, Send, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Head from 'next/head'

function FormViewContent() {
  const searchParams = useSearchParams()
  const { user } = useUser()
  
  // Get form identifier from query params
  const formId = searchParams.get('id') || searchParams.get('form') || ''
  
  const [form, setForm] = useState<Form | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const loadForm = async () => {
      try {
        setIsLoading(true)
        console.log('🔍 Loading form with ID:', formId)
        
        if (!formId) {
          setError('No form ID provided')
          return
        }
        
        const formData = await getForm(formId)
        console.log('✅ Form loaded:', formData.title, formData.id)
        setForm(formData)
        
        // Update page metadata dynamically
        document.title = `${formData.title} | Forms App`
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]')
        if (metaDescription) {
          metaDescription.setAttribute('content', formData.description || `Fill out ${formData.title} form`)
        }
        
      } catch (err) {
        console.error('❌ Error loading form:', err)
        setError('Form not found')
      } finally {
        setIsLoading(false)
      }
    }

    if (formId) {
      loadForm()
    }
  }, [formId])

  const handleFieldChange = (fieldId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value
    }))
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }))
    }
  }

  const handleFileUpload = async (file: File, fieldId: string): Promise<string> => {
    if (!form) throw new Error('Form not loaded')
    
    try {
      const fileRecord = await uploadFile(file, form.id, fieldId)
      return fileRecord.file_url
    } catch (error) {
      console.error('File upload error:', error)
      throw new Error('Failed to upload file')
    }
  }

  const validateForm = (): boolean => {
    if (!form) return false

    const newErrors: Record<string, string> = {}
    let isValid = true

    form.form_data.forEach((field: FormField) => {
      if (field.required) {
        const value = responses[field.id]
        if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors[field.id] = 'This field is required'
          isValid = false
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form || !validateForm()) return

    setSubmitting(true)

    try {
      await submitFormResponse(form.id, responses)
      
      setSubmitted(true)
      console.log('✅ Form submitted successfully')
    } catch (error) {
      console.error('❌ Error submitting form:', error)
      setError('Failed to submit form. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  if (!form) {
    return null
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-6">Your response has been submitted successfully.</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Head>
        <title>{form.title} | Forms App</title>
        <meta name="description" content={form.description || `Fill out ${form.title} form`} />
        <meta property="og:title" content={form.title} />
        <meta property="og:description" content={form.description || `Fill out ${form.title} form`} />
      </Head>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              {form.title}
            </CardTitle>
            {form.description && (
              <CardDescription className="text-lg text-gray-600">
                {form.description}
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {form.form_data.map((field: FormField, index: number) => (
                <div key={field.id}>
                  <AdvancedFormField
                    field={field}
                    value={responses[field.id] || ''}
                    onChange={(value) => handleFieldChange(field.id, value)}
                    onFileUpload={handleFileUpload}
                    disabled={submitting}
                    error={errors[field.id]}
                  />
                </div>
              ))}

              <div className="pt-6 border-t">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Submit Form
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function FormViewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    }>
      <FormViewContent />
    </Suspense>
  )
} 