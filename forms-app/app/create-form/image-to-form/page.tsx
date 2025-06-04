'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowLeft, Upload, Camera, Image as ImageIcon, Wand2, Send } from 'lucide-react'

export default function ImageToFormPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be smaller than 10MB')
        return
      }
      
      setSelectedImage(file)
      setError(null)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!user) {
      alert('Please sign in to generate forms!')
      return
    }

    if (!selectedImage) {
      setError('Please select an image first')
      return
    }

    console.log('🚀 Starting image-to-form generation...')
    console.log('📷 Selected image:', {
      name: selectedImage.name,
      size: selectedImage.size,
      type: selectedImage.type
    })
    console.log('📝 Description:', description)

    setIsGenerating(true)
    setError(null)

    try {
      // Convert image to base64
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64String = e.target?.result as string
        
        console.log('📊 Base64 conversion complete:')
        console.log('  - String length:', base64String.length)
        console.log('  - First 100 chars:', base64String.substring(0, 100))
        console.log('  - Starts with data URL:', base64String.startsWith('data:'))

        const requestPayload = {
          description: description || 'Generate a form based on the image content',
          type: 'image',
          imageBase64: base64String
        }

        console.log('📤 Sending request to API:', {
          description: requestPayload.description,
          type: requestPayload.type,
          imageBase64Length: requestPayload.imageBase64.length
        })

        try {
          const response = await fetch('/api/ai/generate-form', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestPayload)
          })

          console.log('📥 API Response received:')
          console.log('  - Status:', response.status)
          console.log('  - Status text:', response.statusText)
          console.log('  - Headers:', Object.fromEntries(response.headers.entries()))

          if (!response.ok) {
            const errorData = await response.json()
            console.error('❌ API Error:', errorData)
            throw new Error(errorData.error || 'Failed to generate form')
          }

          const responseData = await response.json()
          console.log('✅ API Success response:', responseData)
          
          // Navigate to form builder with the generated form data
          const formData = {
            title: responseData.data.title,
            description: responseData.data.description,
            fields: responseData.data.fields
          }
          
          console.log('📋 Generated form data:', formData)
          
          // Store in sessionStorage to pass to builder
          sessionStorage.setItem('aiGeneratedForm', JSON.stringify(formData))
          console.log('💾 Stored form data in sessionStorage')
          
          router.push('/create-form/builder?source=ai-image')

        } catch (error) {
          console.error('💥 Error in API call:', error)
          setError(error instanceof Error ? error.message : 'Failed to generate form')
        } finally {
          setIsGenerating(false)
        }
      }
      
      reader.readAsDataURL(selectedImage)

    } catch (error) {
      console.error('💥 Error processing image:', error)
      setError('Failed to process image')
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/create-form"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Create Form
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-full">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Image to Form with AI
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload an image of a form, document, or sketch and watch AI recreate it as a digital form!
            </p>
          </div>
        </div>

        {/* Main Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  <ImageIcon className="inline h-5 w-5 mr-2 text-blue-500" />
                  Upload an image
                </label>
                
                <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img 
                        src={imagePreview} 
                        alt="Selected form image" 
                        className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                      />
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Change Image
                        </button>
                        <button
                          onClick={() => {
                            setSelectedImage(null)
                            setImagePreview(null)
                          }}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-gray-500">
                        PNG, JPG, or JPEG up to 10MB
                      </p>
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              {/* Optional Description */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Additional context (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide any additional context about the form or specific requirements..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isGenerating}
                />
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
                  disabled={isGenerating || !selectedImage || !isLoaded}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Analyzing image...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Generate Form from Image
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Examples Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              What types of images work best:
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 text-center border border-blue-200">
                <div className="text-4xl mb-3">📄</div>
                <h3 className="font-semibold text-gray-900 mb-2">Paper Forms</h3>
                <p className="text-gray-600 text-sm">Scanned or photographed paper forms</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center border border-blue-200">
                <div className="text-4xl mb-3">✏️</div>
                <h3 className="font-semibold text-gray-900 mb-2">Hand Sketches</h3>
                <p className="text-gray-600 text-sm">Wireframes or rough form layouts</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center border border-blue-200">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-semibold text-gray-900 mb-2">Data Tables</h3>
                <p className="text-gray-600 text-sm">Spreadsheets or structured data</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center border border-blue-200">
                <div className="text-4xl mb-3">💻</div>
                <h3 className="font-semibold text-gray-900 mb-2">Digital Forms</h3>
                <p className="text-gray-600 text-sm">Screenshots of existing forms</p>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Tips for best results:
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-500 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Clear and readable text</h3>
                    <p className="text-gray-600 text-sm">Ensure field labels and text are clearly visible</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-500 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Good lighting</h3>
                    <p className="text-gray-600 text-sm">Avoid shadows and ensure even lighting</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-500 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Straight orientation</h3>
                    <p className="text-gray-600 text-sm">Keep the image level and properly oriented</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-500 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Complete form visible</h3>
                    <p className="text-gray-600 text-sm">Include all sections you want to recreate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 