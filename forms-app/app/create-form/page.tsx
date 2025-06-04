'use client'

import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { Wand2, Upload, FileText, MessageSquare, ArrowRight, Sparkles, Zap, Clock, Brain } from 'lucide-react'

const creationMethods = [
  {
    id: 'builder',
    title: 'Start from scratch',
    description: 'Manually build with drag & drop',
    icon: Wand2,
    available: true,
    href: '/create-form/builder',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    features: ['Full control', 'Custom fields', 'Advanced logic'],
    benefit: 'Perfect for complex forms with specific requirements'
  },
  {
    id: 'template',
    title: 'Use a template',
    description: 'Start with pre-built templates',
    icon: FileText,
    available: false,
    href: '/create-form/from-template',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    features: ['Quick start', 'Professional designs', 'Industry-specific'],
    benefit: 'Fast deployment with proven form structures'
  },
  {
    id: 'ai-image',
    title: 'Create from file',
    description: 'AI-powered from image upload',
    icon: Upload,
    available: true,
    href: '/create-form/image-to-form',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700',
    features: ['Smart recognition', 'Auto-formatting', 'Image analysis'],
    benefit: 'Transform existing forms or sketches instantly'
  },
  {
    id: 'text-ai',
    title: 'Build from text',
    description: 'AI-powered text description',
    icon: MessageSquare,
    available: true,
    href: '/create-form/text-to-form',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    features: ['Natural language', 'Smart suggestions', 'Context aware'],
    benefit: 'Describe your form and watch AI build it for you'
  }
]

export default function CreateFormLobby() {
  const { user, isLoaded } = useUser()

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
          <p className="text-gray-600">Please sign in to create forms.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full text-sm font-medium text-purple-700 mb-6">
            <Sparkles className="h-4 w-4" />
            Choose your creation method
          </div>
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Create Your Form
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the method that works best for you. From manual building to AI-powered creation - we've got you covered!
          </p>
        </div>

        {/* Creation Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {creationMethods.map((method) => {
            const IconComponent = method.icon
            return (
              <div key={method.id} className="relative group">
                {method.available ? (
                  <Link href={method.href}>
                    <div className={`${method.bgColor} border-2 border-gray-200 rounded-2xl p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer h-full`}>
                      <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className={`text-lg font-bold ${method.textColor} mb-2`}>{method.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{method.description}</p>
                      <div className="flex items-center justify-center text-blue-600 font-medium">
                        <span>Get Started</span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className={`${method.bgColor} border-2 border-gray-200 rounded-2xl p-6 text-center opacity-60 cursor-not-allowed h-full relative`}>
                    <div className="absolute top-3 right-3 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                      Coming Soon
                    </div>
                    <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className={`text-lg font-bold ${method.textColor} mb-2`}>{method.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{method.description}</p>
                    <div className="flex items-center justify-center text-gray-400 font-medium">
                      <span>Coming Soon</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Benefits Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Why Choose Each Method?
              </span>
            </h2>
            <p className="text-gray-600">Each creation method is designed for different use cases and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {creationMethods.map((method, index) => {
              const IconComponent = method.icon
              return (
                <div key={method.id} className={`rounded-2xl p-6 ${method.bgColor} border border-gray-200`}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`text-xl font-bold ${method.textColor}`}>{method.title}</h3>
                        {!method.available && (
                          <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{method.benefit}</p>
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-800">Key Features:</h4>
                        <ul className="space-y-1">
                          {method.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">60 seconds</h3>
            <p className="text-gray-600">Average time to create a form</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-gray-600">Smart suggestions and automation</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Always Free</h3>
            <p className="text-gray-600">No limits on form creation</p>
          </div>
        </div>
      </div>
    </div>
  )
} 