"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { TypeIcon as FormIcon, Send, Heart } from "lucide-react"

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

export default function PublicFormPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState<FormData | null>(null)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Sample form data with vibrant content
    const sampleForm: FormData = {
      title: "Customer Feedback Survey ✨",
      description:
        "We'd love to hear your thoughts about our service! Your feedback helps us create amazing experiences for everyone. 🚀",
      fields: [
        {
          id: "1",
          type: "text",
          label: "What's your awesome name?",
          placeholder: "Enter your full name here",
          required: true,
        },
        {
          id: "2",
          type: "email",
          label: "Email address",
          placeholder: "your@email.com",
          required: true,
        },
        {
          id: "3",
          type: "select",
          label: "How did you discover us?",
          required: true,
          options: ["🔍 Google Search", "📱 Social Media", "👥 Friend Referral", "📺 Advertisement", "🌟 Other"],
        },
        {
          id: "4",
          type: "radio",
          label: "How satisfied are you overall?",
          required: true,
          options: ["😍 Very Satisfied", "😊 Satisfied", "😐 Neutral", "😕 Dissatisfied", "😞 Very Dissatisfied"],
        },
        {
          id: "5",
          type: "textarea",
          label: "Tell us more about your experience!",
          placeholder: "Share your thoughts, suggestions, or anything else you'd like us to know...",
          required: false,
        },
        {
          id: "6",
          type: "checkbox",
          label: "Subscribe to our newsletter for awesome updates! 📧",
          required: false,
        },
      ],
    }
    setFormData(sampleForm)
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate required fields
    const requiredFields = formData?.fields.filter((field) => field.required) || []
    const missingFields = requiredFields.filter((field) => !responses[field.id])

    if (missingFields.length > 0) {
      alert("🚨 Please fill in all required fields to continue!")
      setLoading(false)
      return
    }

    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
    }, 1500)
  }

  const updateResponse = (fieldId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FormIcon className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-600 text-lg">Loading your awesome form... ✨</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              Thank You! 🎉
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 mt-4">
              Your response has been submitted successfully! We absolutely love hearing from amazing people like you.
              Your feedback helps us create better experiences for everyone! ✨
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
              <p className="text-green-700 font-medium">🚀 Response submitted at {new Date().toLocaleTimeString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-2 bg-white/20 rounded-xl">
                <FormIcon className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold">FormCraft</span>
            </div>
            <CardTitle className="text-3xl font-bold">{formData.title}</CardTitle>
            <CardDescription className="text-purple-100 text-lg mt-2">{formData.description}</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {formData.fields.map((field, index) => (
                <div key={field.id} className="space-y-3">
                  <Label htmlFor={field.id} className="text-lg font-semibold text-gray-800">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>

                  {field.type === "text" && (
                    <Input
                      id={field.id}
                      type="text"
                      placeholder={field.placeholder}
                      value={responses[field.id] || ""}
                      onChange={(e) => updateResponse(field.id, e.target.value)}
                      required={field.required}
                      className="border-2 border-purple-200 focus:border-purple-400 transition-colors text-lg py-3"
                    />
                  )}

                  {field.type === "email" && (
                    <Input
                      id={field.id}
                      type="email"
                      placeholder={field.placeholder}
                      value={responses[field.id] || ""}
                      onChange={(e) => updateResponse(field.id, e.target.value)}
                      required={field.required}
                      className="border-2 border-purple-200 focus:border-purple-400 transition-colors text-lg py-3"
                    />
                  )}

                  {field.type === "textarea" && (
                    <Textarea
                      id={field.id}
                      placeholder={field.placeholder}
                      value={responses[field.id] || ""}
                      onChange={(e) => updateResponse(field.id, e.target.value)}
                      required={field.required}
                      rows={4}
                      className="border-2 border-purple-200 focus:border-purple-400 transition-colors text-lg"
                    />
                  )}

                  {field.type === "select" && (
                    <Select
                      value={responses[field.id] || ""}
                      onValueChange={(value) => updateResponse(field.id, value)}
                      required={field.required}
                    >
                      <SelectTrigger className="border-2 border-purple-200 focus:border-purple-400 transition-colors text-lg py-3">
                        <SelectValue placeholder="Choose an option..." />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option} value={option} className="text-lg">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {field.type === "radio" && (
                    <RadioGroup
                      value={responses[field.id] || ""}
                      onValueChange={(value) => updateResponse(field.id, value)}
                      required={field.required}
                      className="space-y-3"
                    >
                      {field.options?.map((option) => (
                        <div
                          key={option}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 transition-colors"
                        >
                          <RadioGroupItem value={option} id={`${field.id}-${option}`} className="text-purple-600" />
                          <Label htmlFor={`${field.id}-${option}`} className="text-lg cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {field.type === "checkbox" && (
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                      <Checkbox
                        id={field.id}
                        checked={responses[field.id] || false}
                        onCheckedChange={(checked) => updateResponse(field.id, checked)}
                        className="text-purple-600"
                      />
                      <Label htmlFor={field.id} className="text-lg cursor-pointer">
                        {field.label}
                      </Label>
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 py-4 text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting your awesome response...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Send className="h-5 w-5" />
                      Submit My Response ✨
                    </div>
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
