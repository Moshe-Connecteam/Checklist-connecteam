"use client"

import { useState, useEffect, Suspense } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TypeIcon as FormIcon, Plus, Trash2, Save, Eye, ArrowLeft, Sparkles, Zap, Palette } from "lucide-react"
import Link from "next/link"
import { createForm, refreshUserAnalytics, getForm, updateForm } from "../../../lib/database"

interface FormField {
  id: string
  type: "text" | "email" | "textarea" | "select" | "radio" | "checkbox" | 
        "number" | "date" | "file" | "image" | "rating" | "location" | 
        "signature" | "audio" | "slider" | "yesno" | "task" | "scanner" | "imageselection"
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  min?: number
  max?: number
  step?: number
  accept?: string // for file types
  multiple?: boolean // for file uploads and selections
  rating_type?: "stars" | "hearts" | "thumbs" | "numbers"
  slider_min?: number
  slider_max?: number
  slider_step?: number
}

interface FormData {
  title: string
  description: string
  fields: FormField[]
}

// Loading component to show while suspense is loading
function FormBuilderLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading form builder...</p>
        </div>
      </div>
    </div>
  )
}

// Actual form builder component that uses useSearchParams
function FormBuilderContent() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [draggedField, setDraggedField] = useState<string | null>(null)
  
  // Check if we're editing an existing form
  const editFormId = searchParams.get('edit')
  const isEditing = !!editFormId
  
  // Check if this is from AI generation
  const source = searchParams.get('source')
  const isFromAI = source === 'ai-text' || source === 'ai-image'
  
  const [formData, setFormData] = useState<FormData>({
    title: "My Awesome Form ✨",
    description: "Tell us what you think - we'd love to hear from you!",
    fields: [
      {
        id: "sample-1",
        type: "text",
        label: "What's your name?",
        placeholder: "Enter your awesome name",
        required: true,
      },
      {
        id: "sample-2",
        type: "email",
        label: "Email address",
        placeholder: "your@email.com",
        required: true,
      },
    ],
  })

  // Load AI-generated form data or existing form data
  useEffect(() => {
    const loadFormData = async () => {
      setIsLoading(true)
      
      try {
        // Load AI-generated form
        if (isFromAI) {
          const aiFormData = sessionStorage.getItem('aiGeneratedForm')
          if (aiFormData) {
            const parsedData = JSON.parse(aiFormData)
            setFormData({
              title: parsedData.title || "AI Generated Form ✨",
              description: parsedData.description || "Form created with AI",
              fields: parsedData.fields?.map((field: any, index: number) => ({
                ...field,
                id: field.id || `ai-field-${index + 1}`
              })) || []
            })
            // Clear from sessionStorage after loading
            sessionStorage.removeItem('aiGeneratedForm')
          }
        }
        // Load existing form for editing
        else if (isEditing && editFormId && user) {
          const existingForm = await getForm(editFormId)
          setFormData({
            title: existingForm.title,
            description: existingForm.description || "",
            fields: existingForm.form_data || []
          })
        }
      } catch (error) {
        console.error('Error loading form:', error)
        if (isEditing) {
          alert('Failed to load form for editing')
          router.push('/dashboard')
        } else {
          alert('Failed to load AI-generated form')
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (isLoaded) {
      loadFormData()
    }
  }, [isEditing, editFormId, user, isLoaded, router, isFromAI])

  const addField = (type: FormField["type"]) => {
    const fieldLabels = {
      text: "What would you like to know?",
      email: "Email address",
      textarea: "Tell us more!",
      select: "Pick your favorite",
      radio: "Choose one option",
      checkbox: "Check if you agree",
      number: "Enter a number",
      date: "Select a date",
      file: "Upload a file",
      image: "Upload an image",
      rating: "Rate this item",
      location: "Choose location",
      signature: "Your signature",
      audio: "Record audio",
      slider: "Select value",
      yesno: "Yes or No?",
      task: "Complete this task",
      scanner: "Scan QR/Barcode",
      imageselection: "Select from images"
    }

    // Get today's date in YYYY-MM-DD format for date fields
    const getTodayDate = () => {
      const today = new Date()
      return today.toISOString().split('T')[0]
    }

    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: fieldLabels[type],
      required: false,
      ...(type === "text" || type === "email" ? { placeholder: "Type here..." } : {}),
      ...(type === "textarea" ? { placeholder: "Share your thoughts..." } : {}),
      ...(type === "number" ? { placeholder: "Enter number...", min: 0, max: 100, step: 1 } : {}),
      ...(type === "date" ? { placeholder: getTodayDate() } : {}), // Set today's date as default
      ...(type === "select" || type === "radio" ? { options: ["Option 1 🎯", "Option 2 🚀", "Option 3 ✨"] } : {}),
      ...(type === "file" ? { accept: "*/*", multiple: false } : {}),
      ...(type === "image" ? { accept: "image/*", multiple: false } : {}),
      ...(type === "audio" ? { accept: "audio/*" } : {}),
      ...(type === "rating" ? { rating_type: "stars", min: 1, max: 5 } : {}),
      ...(type === "slider" ? { slider_min: 0, slider_max: 100, slider_step: 1 } : {}),
      ...(type === "imageselection" ? { multiple: true, options: [] } : {}),
    }
    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }))
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((field) => (field.id === id ? { ...field, ...updates } : field)),
    }))
  }

  const removeField = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field.id !== id),
    }))
  }

  const handleDragStart = (e: React.DragEvent, fieldId: string) => {
    console.log('🎯 Drag started for field:', fieldId)
    setDraggedField(fieldId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', fieldId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetFieldId: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('🎯 Drop triggered:', { draggedField, targetFieldId })
    
    if (!draggedField || draggedField === targetFieldId) {
      setDraggedField(null)
      return
    }

    setFormData((prev) => {
      const fields = [...prev.fields]
      const draggedIndex = fields.findIndex((field) => field.id === draggedField)
      const targetIndex = fields.findIndex((field) => field.id === targetFieldId)
      
      console.log('🎯 Reordering:', { draggedIndex, targetIndex })
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const draggedItem = fields[draggedIndex]
        fields.splice(draggedIndex, 1)
        fields.splice(targetIndex, 0, draggedItem)
        console.log('✅ Fields reordered successfully')
      }
      
      return { ...prev, fields }
    })
    
    setDraggedField(null)
  }

  const handleDragEnd = () => {
    console.log('🎯 Drag ended')
    setDraggedField(null)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const saveForm = async () => {
    if (!user) {
      alert("Please sign in to save your form!")
      return
    }

    if (!formData.title.trim()) {
      alert("Please add a title to your form!")
      return
    }

    setIsSaving(true)
    
    try {
      if (isEditing && editFormId) {
        // Update existing form
        await updateForm(editFormId, {
          title: formData.title,
          description: formData.description,
          form_data: formData.fields,
          is_published: true
        })
        alert("🎉 Form updated successfully!")
      } else {
        // Create new form
        await createForm(
          user.id,
          formData.title,
          formData.description,
          formData.fields
        )
        alert("🎉 Form saved successfully!")
      }
      
      // Update user analytics
      await refreshUserAnalytics(user.id)
      
      // Redirect to dashboard to see the form
      router.push("/dashboard")
    } catch (error) {
      console.error("Error saving form:", error)
      alert("❌ Failed to save form. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {isEditing ? "Edit Your Form" : "Build Something Amazing"}
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            {isEditing ? "Update your form to make it even better! 🎨" : "Drag, drop, and create forms that people will love to fill out! 🎨"}
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Link
              href="/create-form"
              className="bg-purple-100 text-purple-700 px-4 py-2 rounded-md hover:bg-purple-200 transition-colors"
            >
              ← Back to Create Form
            </Link>
            <Link
              href="/dashboard"
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Dashboard
            </Link>
            <Button
              variant="outline"
              onClick={saveForm}
              disabled={isSaving || !isLoaded || isLoading}
              className="border-purple-200 hover:bg-purple-50 hover:border-purple-300"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? (isEditing ? "Updating..." : "Saving...") : (isEditing ? "Update Form" : "Save Form")}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Builder */}
          <div className="lg:col-span-2 space-y-6">
            {/* Form Settings */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Form Settings
                </CardTitle>
                <CardDescription>Make your form shine with a great title and description!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-gray-700 font-medium">
                    Form Title
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="border-2 border-purple-100 focus:border-purple-400 transition-colors"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-gray-700 font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="border-2 border-purple-100 focus:border-purple-400 transition-colors"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Form Fields */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Zap className="h-5 w-5 text-pink-500" />
                  Form Fields
                </CardTitle>
                <CardDescription>Customize each field to get exactly the info you need</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.fields.length > 1 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-700 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                      💡 Tip: Click and drag the ≡ icon to reorder your fields!
                    </p>
                  </div>
                )}
                {formData.fields.map((field, index) => (
                  <Card
                    key={field.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, field.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, field.id)}
                    onDragEnd={handleDragEnd}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    className={`p-4 border-2 cursor-move transition-all duration-200 ${
                      draggedField === field.id 
                        ? 'opacity-50 scale-95 rotate-2 border-dashed border-blue-400 bg-blue-50' 
                        : index % 3 === 0
                          ? "border-purple-200 bg-purple-50/50 hover:shadow-md hover:border-purple-300"
                          : index % 3 === 1
                            ? "border-pink-200 bg-pink-50/50 hover:shadow-md hover:border-pink-300"
                            : "border-orange-200 bg-orange-50/50 hover:shadow-md hover:border-orange-300"
                    } ${
                      draggedField && draggedField !== field.id
                        ? 'hover:border-blue-400 hover:bg-blue-50/30 hover:border-dashed'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-200 transition-colors">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 12h16M4 16h16" />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-800">
                          Field {index + 1}: {field.type} {index < 2 ? "✨" : ""}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField(field.id)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-4">
                      <div>
                        <Label className="text-gray-700 font-medium">Label</Label>
                        <Input
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          className="border-2 border-gray-200 focus:border-purple-400 transition-colors"
                        />
                      </div>
                      {(field.type === "text" || field.type === "email" || field.type === "textarea" || field.type === "number") && (
                        <div>
                          <Label className="text-gray-700 font-medium">Placeholder</Label>
                          <Input
                            value={field.placeholder || ""}
                            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                            className="border-2 border-gray-200 focus:border-purple-400 transition-colors"
                          />
                        </div>
                      )}
                      {(field.type === "select" || field.type === "radio" || field.type === "imageselection") && (
                        <div>
                          <Label className="text-gray-700 font-medium">
                            {field.type === "imageselection" 
                              ? "Upload Images for Selection"
                              : "Options (one per line)"
                            }
                          </Label>
                          
                          {field.type === "imageselection" ? (
                            <div className="space-y-3">
                              {/* Image Upload */}
                              <div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => {
                                    const files = Array.from(e.target.files || [])
                                    if (files.length > 0) {
                                      // Convert files to base64 and add to options
                                      Promise.all(
                                        files.map(file => {
                                          return new Promise<string>((resolve) => {
                                            const reader = new FileReader()
                                            reader.onload = (e) => resolve(e.target?.result as string)
                                            reader.readAsDataURL(file)
                                          })
                                        })
                                      ).then(base64Images => {
                                        const currentOptions = field.options || []
                                        updateField(field.id, {
                                          options: [...currentOptions, ...base64Images]
                                        })
                                      })
                                    }
                                  }}
                                  className="w-full border-2 border-gray-200 focus:border-purple-400 transition-colors rounded-md px-3 py-2"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  📤 Upload multiple images that users can choose from
                                </p>
                              </div>
                              
                              {/* Display uploaded images */}
                              {field.options && field.options.length > 0 && (
                                <div>
                                  <Label className="text-gray-700 font-medium">Uploaded Images ({field.options.length})</Label>
                                  <div className="grid grid-cols-3 gap-2 mt-2">
                                    {field.options.map((imageData, index) => (
                                      <div key={index} className="relative group">
                                        <img 
                                          src={imageData} 
                                          alt={`Option ${index + 1}`}
                                          className="w-full h-20 object-cover rounded border-2 border-gray-200"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newOptions = field.options?.filter((_, i) => i !== index) || []
                                            updateField(field.id, { options: newOptions })
                                          }}
                                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Multiple selection option */}
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={`multiple-selection-${field.id}`}
                                  checked={field.multiple || false}
                                  onChange={(e) => updateField(field.id, { multiple: e.target.checked })}
                                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                />
                                <Label htmlFor={`multiple-selection-${field.id}`} className="text-gray-700 font-medium">
                                  Allow multiple image selections
                                </Label>
                              </div>
                            </div>
                          ) : (
                            <Textarea
                              value={field.options?.join("\n") || ""}
                              onChange={(e) =>
                                updateField(field.id, {
                                  options: e.target.value.split("\n").filter(Boolean),
                                })
                              }
                              className="border-2 border-gray-200 focus:border-purple-400 transition-colors"
                              rows={3}
                              placeholder="Option 1\nOption 2\nOption 3"
                            />
                          )}
                        </div>
                      )}
                      {(field.type === "number" || field.type === "rating") && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-gray-700 font-medium">Min</Label>
                            <Input
                              type="number"
                              value={field.min || ""}
                              onChange={(e) => updateField(field.id, { min: parseFloat(e.target.value) || undefined })}
                              className="border-2 border-gray-200 focus:border-purple-400 transition-colors"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-700 font-medium">Max</Label>
                            <Input
                              type="number"
                              value={field.max || ""}
                              onChange={(e) => updateField(field.id, { max: parseFloat(e.target.value) || undefined })}
                              className="border-2 border-gray-200 focus:border-purple-400 transition-colors"
                            />
                          </div>
                        </div>
                      )}
                      {field.type === "slider" && (
                        <div className="space-y-2">
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <Label className="text-gray-700 font-medium">Min</Label>
                              <Input
                                type="number"
                                value={field.slider_min || ""}
                                onChange={(e) => updateField(field.id, { slider_min: parseFloat(e.target.value) || 0 })}
                                className="border-2 border-gray-200 focus:border-purple-400 transition-colors"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-700 font-medium">Max</Label>
                              <Input
                                type="number"
                                value={field.slider_max || ""}
                                onChange={(e) => updateField(field.id, { slider_max: parseFloat(e.target.value) || 100 })}
                                className="border-2 border-gray-200 focus:border-purple-400 transition-colors"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-700 font-medium">Step</Label>
                              <Input
                                type="number"
                                value={field.slider_step || ""}
                                onChange={(e) => updateField(field.id, { slider_step: parseFloat(e.target.value) || 1 })}
                                className="border-2 border-gray-200 focus:border-purple-400 transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      {field.type === "rating" && (
                        <div>
                          <Label className="text-gray-700 font-medium">Rating Type</Label>
                          <select
                            value={field.rating_type || "stars"}
                            onChange={(e) => updateField(field.id, { rating_type: e.target.value as "stars" | "hearts" | "thumbs" | "numbers" })}
                            className="w-full border-2 border-gray-200 focus:border-purple-400 transition-colors rounded-md px-3 py-2"
                          >
                            <option value="stars">⭐ Stars</option>
                            <option value="hearts">❤️ Hearts</option>
                            <option value="thumbs">👍 Thumbs</option>
                            <option value="numbers">🔢 Numbers</option>
                          </select>
                        </div>
                      )}
                      {(field.type === "file" || field.type === "image" || field.type === "audio") && (
                        <div className="space-y-2">
                          <div>
                            <Label className="text-gray-700 font-medium">Accept File Types</Label>
                            <Input
                              value={field.accept || ""}
                              onChange={(e) => updateField(field.id, { accept: e.target.value })}
                              placeholder="e.g., .pdf,.doc,.docx or image/* or audio/*"
                              className="border-2 border-gray-200 focus:border-purple-400 transition-colors"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`multiple-${field.id}`}
                              checked={field.multiple || false}
                              onChange={(e) => updateField(field.id, { multiple: e.target.checked })}
                              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <Label htmlFor={`multiple-${field.id}`} className="text-gray-700 font-medium">
                              Allow multiple files
                            </Label>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`required-${field.id}`}
                          checked={field.required}
                          onChange={(e) => updateField(field.id, { required: e.target.checked })}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <Label htmlFor={`required-${field.id}`} className="text-gray-700 font-medium">
                          Required field
                        </Label>
                      </div>
                    </div>
                  </Card>
                ))}

                {formData.fields.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FormIcon className="h-8 w-8 text-purple-500" />
                    </div>
                    <p className="text-lg">No fields yet! Add some from the sidebar to get started 🚀</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Plus className="h-5 w-5 text-green-500" />
                  Elements
                </CardTitle>
                <CardDescription>Basic form elements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all"
                  onClick={() => addField("textarea")}
                >
                  <Plus className="h-4 w-4 mr-2" />📄 Description
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Zap className="h-5 w-5 text-blue-500" />
                  Fields
                </CardTitle>
                <CardDescription>Click to add field types to your form!</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                {/* First Column */}
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all"
                    onClick={() => addField("text")}
                  >
                    📝 Text Input
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs border-2 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all"
                    onClick={() => addField("select")}
                  >
                    📋 Dropdown
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all"
                    onClick={() => addField("textarea")}
                  >
                    📝 Open ended
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                    onClick={() => addField("yesno")}
                  >
                    ✅ Yes/No
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs border-2 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all"
                    onClick={() => addField("scanner")}
                  >
                    📷 Scanner
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs border-2 border-yellow-200 hover:bg-yellow-50 hover:border-yellow-300 transition-all"
                    onClick={() => addField("rating")}
                  >
                    ⭐ Rating
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs border-2 border-sky-200 hover:bg-sky-50 hover:border-sky-300 transition-all"
                    onClick={() => addField("signature")}
                  >
                    ✍️ Signature
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all"
                    onClick={() => addField("radio")}
                  >
                    🔘 Radio Buttons
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all"
                    onClick={() => addField("audio")}
                  >
                    🎤 Audio recording
                  </Button>
                </div>

                {/* Second Column */}
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs border-2 border-pink-200 hover:bg-pink-50 hover:border-pink-300 transition-all"
                    onClick={() => addField("email")}
                  >
                    📧 Email Input
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs border-2 border-violet-200 hover:bg-violet-50 hover:border-violet-300 transition-all"
                    onClick={() => addField("imageselection")}
                    title="Image Selection: Upload images that users can select from. Supports multiple selections."
                  >
                    🖼️ Image selection
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs border-2 border-cyan-200 hover:bg-cyan-50 hover:border-cyan-300 transition-all"
                    onClick={() => addField("number")}
                  >
                    # Number
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs border-2 border-lime-200 hover:bg-lime-50 hover:border-lime-300 transition-all"
                    onClick={() => addField("location")}
                  >
                    📍 Location
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs border-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300 transition-all"
                    onClick={() => addField("date")}
                  >
                    📅 Date
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all"
                    onClick={() => addField("image")}
                  >
                    🖼️ Image upload
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs border-2 border-rose-200 hover:bg-rose-50 hover:border-rose-300 transition-all"
                    onClick={() => addField("file")}
                  >
                    📎 File upload
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                    onClick={() => addField("checkbox")}
                  >
                    ☑️ Checkbox
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs border-2 border-stone-200 hover:bg-stone-50 hover:border-stone-300 transition-all"
                    onClick={() => addField("task")}
                  >
                    ☑️ Task
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs border-2 border-teal-200 hover:bg-teal-50 hover:border-teal-300 transition-all"
                    onClick={() => addField("slider")}
                  >
                    🎚️ Numbers slider
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Form Preview */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-100 to-pink-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-purple-800">
                  <Eye className="h-5 w-5" />
                  Mobile Preview
                </CardTitle>
                <CardDescription className="text-purple-600">See how your form looks on mobile!</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Mobile Frame */}
                <div className="relative mx-auto w-64 bg-black rounded-3xl p-2 shadow-2xl">
                  {/* Phone Screen */}
                  <div className="bg-white rounded-2xl overflow-hidden">
                    {/* Status Bar */}
                    <div className="bg-white px-4 py-2 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1">
                        <div className="flex gap-1">
                          <div className="w-1 h-1 bg-black rounded-full"></div>
                          <div className="w-1 h-1 bg-black rounded-full"></div>
                          <div className="w-1 h-1 bg-black rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        </div>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <path d="M3 7H21L19 2H5L3 7Z" stroke="currentColor" strokeWidth="2"/>
                          <path d="M3 7V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V7" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="text-black text-xs">100%</div>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
                        </svg>
                      </div>
                    </div>
                    
                    {/* Form Content */}
                    <div className="p-4 space-y-3 h-96 overflow-y-auto">
                      <div>
                        <h3 className="font-bold text-sm text-gray-800">{formData.title}</h3>
                        <p className="text-gray-600 text-xs mt-1">{formData.description}</p>
                      </div>
                      
                      {formData.fields.map((field, index) => (
                        <div key={field.id} className="space-y-1">
                          <label className="text-xs font-medium text-gray-700 block">
                            {index + 1}. {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          <div className={`h-6 rounded border text-xs flex items-center px-2 text-gray-400 ${
                            field.type === 'checkbox' ? 'h-4' :
                            field.type === 'rating' ? 'h-6' :
                            field.type === 'slider' ? 'h-4' :
                            field.type === 'yesno' ? 'h-8' : 'h-6'
                          } ${
                            index % 4 === 0 ? "bg-blue-50 border-blue-200" :
                            index % 4 === 1 ? "bg-green-50 border-green-200" :
                            index % 4 === 2 ? "bg-purple-50 border-purple-200" :
                            "bg-orange-50 border-orange-200"
                          }`}>
                            {field.type === 'checkbox' && '☐'}
                            {field.type === 'rating' && '⭐⭐⭐⭐⭐'}
                            {field.type === 'yesno' && (
                              <div className="flex gap-2">
                                <span className="text-green-600">✅ Yes</span>
                                <span className="text-red-600">❌ No</span>
                              </div>
                            )}
                            {field.type === 'slider' && <div className="w-full h-1 bg-gray-300 rounded"></div>}
                            {!['checkbox', 'rating', 'yesno', 'slider'].includes(field.type) && 
                              (field.placeholder || `${field.type} field`)
                            }
                          </div>
                        </div>
                      ))}
                      
                      {formData.fields.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <div className="text-xs">Add fields to see preview</div>
                        </div>
                      )}
                      
                      <button className="w-full bg-blue-500 text-white text-sm py-2 rounded-lg mt-4">
                        Send
                      </button>
                    </div>
                    
                    {/* Bottom indicator */}
                    <div className="bg-white p-2 flex justify-center">
                      <div className="w-32 h-1 bg-black rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Reset Preview Button */}
                <button className="w-full mt-4 text-blue-600 text-sm flex items-center justify-center gap-2 hover:text-blue-800">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset preview
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FormBuilderPage() {
  return (
    <Suspense fallback={<FormBuilderLoading />}>
      <FormBuilderContent />
    </Suspense>
  )
}
