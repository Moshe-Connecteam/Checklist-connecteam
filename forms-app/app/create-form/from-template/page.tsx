'use client'

import Link from 'next/link'
import { FileText, ArrowLeft, Sparkles, Zap, Users, Star } from 'lucide-react'

export default function TemplateFormCreator() {
  const templateCategories = [
    {
      name: 'Contact Forms',
      description: 'Customer inquiries, support tickets, feedback',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Event Registration',
      description: 'Conferences, workshops, webinars, parties',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Surveys & Feedback',
      description: 'Customer satisfaction, market research, polls',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Lead Generation',
      description: 'Newsletter signups, product demos, quotes',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      name: 'Job Applications',
      description: 'Career applications, HR forms, onboarding',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      name: 'Educational',
      description: 'Course enrollment, quizzes, assessments',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/create-form"
            className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Create Form
          </Link>
        </div>

        {/* Coming Soon Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <FileText className="h-12 w-12 text-white" />
            </div>
            
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full text-sm font-medium text-purple-700 mb-6">
              <Sparkles className="h-4 w-4" />
              Coming Soon
            </div>
            
            <h1 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Professional Form Templates
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Skip the setup and start with professionally designed templates. Choose from dozens of industry-specific forms and customize them to your needs.
            </p>
          </div>

          {/* Template Categories Preview */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Template Categories
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templateCategories.map((category, index) => (
                <div key={index} className={`${category.bgColor} rounded-2xl p-6 border border-gray-200`}>
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4`}>
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Instant Setup</h3>
              <p className="text-gray-600">Pre-configured fields and validation rules save you hours of work</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Industry Tested</h3>
              <p className="text-gray-600">Templates used by thousands of businesses across various industries</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Fully Customizable</h3>
              <p className="text-gray-600">Start with a template and modify everything to match your brand</p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl p-8 text-white text-center">
            <h3 className="text-3xl font-bold mb-4">Launch Your Forms Faster</h3>
            <p className="text-xl mb-8 opacity-90">
              We're curating the best form templates from top designers and industry experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg text-gray-900 w-full"
              />
              <button className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
                Get Early Access
              </button>
            </div>
          </div>

          {/* Alternative Action */}
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Want to start building right now?</p>
            <Link
              href="/create-form/builder"
              className="inline-flex items-center bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              Build from Scratch
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 