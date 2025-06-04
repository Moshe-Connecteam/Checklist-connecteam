"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TypeIcon as FormIcon, Plus, Trash2, Save, Eye, ArrowLeft, Sparkles, Zap, Palette } from "lucide-react"
import Link from "next/link"
import { createForm, refreshUserAnalytics, getForm, updateForm } from "../../lib/database"

interface FormField {
  id: string
  type: "text" | "email" | "textarea" | "select" | "radio" | "checkbox"
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
}

interface FormData {
  title: string
  description: string
  fields: FormField[]
}

export default function FormBuilderPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [draggedField, setDraggedField] = useState<string | null>(null)
  
  // Check if we're editing an existing form
  const editFormId = searchParams.get('edit')
  const isEditing = !!editFormId
  
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

  // Load existing form data if editing
  useEffect(() => {
    const loadExistingForm = async () => {
      if (!isEditing || !editFormId || !user) return
      
      setIsLoading(true)
      try {
        const existingForm = await getForm(editFormId)
        setFormData({
          title: existingForm.title,
          description: existingForm.description || "",
          fields: existingForm.form_data || []
        })
      } catch (error) {
        console.error('Error loading form:', error)
        alert('Failed to load form for editing')
        router.push('/dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    if (isLoaded) {
      loadExistingForm()
    }
  }, [isEditing, editFormId, user, isLoaded, router])

  const addField = (type: FormField["type"]) => {
    const fieldLabels = {
      text: "What would you like to know?",
      email: "Email address",
      textarea: "Tell us more!",
      select: "Pick your favorite",
      radio: "Choose one option",
      checkbox: "Check if you agree",
    }

    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: fieldLabels[type],
      required: false,
      ...(type === "text" || type === "email" ? { placeholder: "Type here..." } : {}),
      ...(type === "textarea" ? { placeholder: "Share your thoughts..." } : {}),
      ...(type === "select" || type === "radio" ? { options: ["Option 1 🎯", "Option 2 🚀", "Option 3 ✨"] } : {}),
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
    setDraggedField(fieldId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetFieldId: string) => {
    e.preventDefault()
    
    if (!draggedField || draggedField === targetFieldId) {
      setDraggedField(null)
      return
    }

    setFormData((prev) => {
      const fields = [...prev.fields]
      const draggedIndex = fields.findIndex((field) => field.id === draggedField)
      const targetIndex = fields.findIndex((field) => field.id === targetFieldId)
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const draggedItem = fields[draggedIndex]
        fields.splice(draggedIndex, 1)
        fields.splice(targetIndex, 0, draggedItem)
      }
      
      return { ...prev, fields }
    })
    
    setDraggedField(null)
  }

  const handleDragEnd = () => {
    setDraggedField(null)
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
              href="/dashboard"
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              ← Back to Dashboard
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
                {formData.fields.map((field, index) => (
                  <Card
                    key={field.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, field.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, field.id)}
                    onDragEnd={handleDragEnd}
                    className={`p-4 border-2 cursor-move transition-all ${
                      draggedField === field.id 
                        ? 'opacity-50 scale-95' 
                        : index % 3 === 0
                          ? "border-purple-200 bg-purple-50/50 hover:shadow-md"
                          : index % 3 === 1
                            ? "border-pink-200 bg-pink-50/50 hover:shadow-md"
                            : "border-orange-200 bg-orange-50/50 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="cursor-grab active:cursor-grabbing">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
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
                      {(field.type === "text" || field.type === "email" || field.type === "textarea") && (
                        <div>
                          <Label className="text-gray-700 font-medium">Placeholder</Label>
                          <Input
                            value={field.placeholder || ""}
                            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                            className="border-2 border-gray-200 focus:border-purple-400 transition-colors"
                          />
                        </div>
                      )}
                      {(field.type === "select" || field.type === "radio") && (
                        <div>
                          <Label className="text-gray-700 font-medium">Options (one per line)</Label>
                          <Textarea
                            value={field.options?.join("\n") || ""}
                            onChange={(e) =>
                              updateField(field.id, {
                                options: e.target.value.split("\n").filter(Boolean),
                              })
                            }
                            className="border-2 border-gray-200 focus:border-purple-400 transition-colors"
                            rows={3}
                          />
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
                  Add Fields
                </CardTitle>
                <CardDescription>Click to add awesome fields to your form!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all"
                  onClick={() => addField("text")}
                >
                  <Plus className="h-4 w-4 mr-2" />📝 Text Input
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-2 border-pink-200 hover:bg-pink-50 hover:border-pink-300 transition-all"
                  onClick={() => addField("email")}
                >
                  <Plus className="h-4 w-4 mr-2" />📧 Email Input
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all"
                  onClick={() => addField("textarea")}
                >
                  <Plus className="h-4 w-4 mr-2" />📄 Text Area
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-2 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all"
                  onClick={() => addField("select")}
                >
                  <Plus className="h-4 w-4 mr-2" />📋 Dropdown
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all"
                  onClick={() => addField("radio")}
                >
                  <Plus className="h-4 w-4 mr-2" />🔘 Radio Buttons
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                  onClick={() => addField("checkbox")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  ☑️ Checkbox
                </Button>
              </CardContent>
            </Card>

            {/* Form Preview */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-100 to-pink-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-purple-800">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </CardTitle>
                <CardDescription className="text-purple-600">See how your form looks in real-time!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm bg-white/60 p-4 rounded-lg">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{formData.title}</h3>
                    <p className="text-gray-600 mt-1">{formData.description}</p>
                  </div>
                  {formData.fields.map((field, index) => (
                    <div key={field.id} className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <div
                        className={`h-8 rounded border-2 text-xs flex items-center px-3 text-gray-500 ${
                          index % 3 === 0
                            ? "bg-purple-50 border-purple-200"
                            : index % 3 === 1
                              ? "bg-pink-50 border-pink-200"
                              : "bg-orange-50 border-orange-200"
                        }`}
                      >
                        {field.placeholder || `${field.type} field`}
                      </div>
                    </div>
                  ))}
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 mt-4">
                    Submit Form ✨
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
