'use client'

import Link from 'next/link'
import { Upload, ArrowLeft, Sparkles, FileImage, Wand2 } from 'lucide-react'

export default function AIImageFormCreator() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/create-form"
            className="inline-flex items-center text-gray-600 hover:text-pink-600 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Create Form
          </Link>
        </div>

        {/* Coming Soon Section */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Upload className="h-12 w-12 text-white" />
            </div>
            
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full text-sm font-medium text-pink-700 mb-6">
              <Sparkles className="h-4 w-4" />
              Coming Soon
            </div>
            
            <h1 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered Form Creation
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Upload an image of an existing form, sketch, or document and watch our AI instantly transform it into a fully functional digital form.
            </p>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-pink-50 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileImage className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-pink-700 mb-2">Smart Recognition</h3>
                <p className="text-sm text-gray-600">Advanced OCR and field detection technology</p>
              </div>
              
              <div className="bg-purple-50 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Wand2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-purple-700 mb-2">Auto-Format</h3>
                <p className="text-sm text-gray-600">Intelligently formats fields and layouts</p>
              </div>
              
              <div className="bg-orange-50 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-orange-700 mb-2">Instant Results</h3>
                <p className="text-sm text-gray-600">Form ready in seconds, not hours</p>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Be the first to know!</h3>
              <p className="mb-6 opacity-90">We're putting the finishing touches on this amazing feature. Sign up to get notified when it's ready!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="px-4 py-3 rounded-lg text-gray-900 w-full sm:w-auto min-w-80"
                />
                <button className="bg-white text-pink-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                  Notify Me
                </button>
              </div>
            </div>

            {/* Alternative Action */}
            <div className="mt-8">
              <p className="text-gray-600 mb-4">In the meantime, create your form manually:</p>
              <Link
                href="/create-form/builder"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Start Building Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 