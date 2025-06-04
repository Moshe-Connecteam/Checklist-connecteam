'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getForm, submitFormResponse, uploadFile } from '../../../lib/database'
import { Form, FormField } from '../../../lib/supabase'
import { AdvancedFormField } from '../../../components/AdvancedFormFields'

export default function PublicFormPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params.id as string
  
  const [form, setForm] = useState<Form | null>(null)
  const [formFields, setFormFields] = useState<FormField[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const loadForm = async () => {
      try {
        const formData = await getForm(formId)
        setForm(formData)
        setFormFields(formData.form_data || [])
        
        // Initialize form data with empty values
        const initialData: Record<string, any> = {}
        formData.form_data?.forEach((field: FormField) => {
          if (field.type === 'checkbox' || field.type === 'yesno' || field.type === 'task') {
            initialData[field.id] = false
          } else if (field.type === 'rating') {
            initialData[field.id] = 0
          } else if (field.type === 'slider') {
            initialData[field.id] = field.slider_min || 0
          } else {
            initialData[field.id] = ''
          }
        })
        setFormData(initialData)
      } catch (err) {
        console.error('Error loading form:', err)
        setError('Form not found or no longer available')
      } finally {
        setIsLoading(false)
      }
    }

    if (formId) {
      loadForm()
    }
  }, [formId])

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
    
    // Clear field error when value changes
    if (fieldErrors[fieldId]) {
      setFieldErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }))
    }
  }

  const handleFileUpload = async (file: File, fieldId: string): Promise<string> => {
    try {
      const fileData = await uploadFile(file, formId, fieldId)
      return fileData.file_url
    } catch (error) {
      console.error('File upload error:', error)
      throw new Error('Failed to upload file')
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    formFields.forEach(field => {
      if (field.required) {
        const value = formData[field.id]
        
        if (field.type === 'checkbox' || field.type === 'yesno' || field.type === 'task') {
          if (!value) {
            errors[field.id] = `${field.label} is required`
          }
        } else if (field.type === 'rating') {
          if (!value || value === 0) {
            errors[field.id] = `${field.label} is required`
          }
        } else if (field.type === 'imageselection' && field.multiple) {
          if (!value || (Array.isArray(value) && value.length === 0)) {
            errors[field.id] = `${field.label} is required`
          }
        } else {
          if (!value || value === '') {
            errors[field.id] = `${field.label} is required`
          }
        }
      }
    })
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await submitFormResponse(formId, formData)
      setSubmitted(true)
    } catch (err) {
      console.error('Error submitting form:', err)
      alert('Failed to submit form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Form Not Found</h2>
          <p className="text-gray-600">{error || 'This form does not exist or has been removed.'}</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600">Your response has been submitted successfully.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          {/* Form Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{form.title}</h1>
            {form.description && (
              <p className="text-gray-600 text-lg">{form.description}</p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {formFields.map((field) => (
              <AdvancedFormField
                key={field.id}
                field={field}
                value={formData[field.id]}
                onChange={(value) => handleInputChange(field.id, value)}
                onFileUpload={handleFileUpload}
                disabled={isSubmitting}
                error={fieldErrors[field.id]}
              />
            ))}

            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Form'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 