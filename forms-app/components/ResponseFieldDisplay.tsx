'use client'

import React, { useState } from 'react'
import { FormField } from '../lib/supabase'

interface ResponseFieldDisplayProps {
  field: FormField
  value: any
}

// Image Modal Component
const ImageModal: React.FC<{
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}> = ({ src, alt, isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
        <img 
          src={src} 
          alt={alt} 
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
        />
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center text-xl font-bold shadow-lg hover:bg-gray-200 transition-colors"
          title="Close"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

// Image Thumbnail Component for Image Selection Display
const ImageThumbnail: React.FC<{
  imageData: string
  index: number
}> = ({ imageData, index }) => {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div 
        className="cursor-pointer border-2 border-gray-300 rounded-lg overflow-hidden hover:shadow-lg hover:border-blue-400 transition-all transform hover:scale-105 relative"
        onClick={() => setModalOpen(true)}
      >
        <img 
          src={imageData} 
          alt={`Selected image ${index + 1}`}
          className="w-full h-24 object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            e.currentTarget.style.display = 'none'
            const fallback = e.currentTarget.nextElementSibling as HTMLElement
            if (fallback) {
              fallback.style.display = 'flex'
            }
          }}
        />
        {/* Fallback display if image fails to load */}
        <div className="hidden w-full h-24 bg-gray-100 items-center justify-center">
          <div className="text-center">
            <div className="text-2xl text-gray-400">🖼️</div>
            <div className="text-xs text-gray-500">Image {index + 1}</div>
          </div>
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 flex items-center justify-center transition-all duration-200">
          <div className="text-white opacity-0 hover:opacity-100 transition-opacity">
            🔍 Click to enlarge
          </div>
        </div>
      </div>
      
      <ImageModal
        src={imageData}
        alt={`Selected image ${index + 1}`}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}

// File Display Component
const FileDisplay: React.FC<{
  file: any
  fieldType: string
}> = ({ file, fieldType }) => {
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const isBase64 = file.url && file.url.startsWith('data:')
  const isImage = fieldType === 'image' || file.file_type?.startsWith('image/') || file.name?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
  const isAudio = fieldType === 'audio' || file.file_type?.startsWith('audio/') || file.name?.match(/\.(mp3|wav|ogg|m4a)$/i)

  const handleDownload = () => {
    if (isBase64) {
      // Create download link for Base64 data
      const link = document.createElement('a')
      link.href = file.url
      link.download = file.name
      link.click()
    } else {
      // Open URL in new tab
      window.open(file.url, '_blank')
    }
  }

  if (isImage) {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div 
            className="cursor-pointer border border-gray-300 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            onClick={() => setImageModalOpen(true)}
          >
            <img 
              src={file.url} 
              alt={file.name}
              className="w-20 h-20 object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">{file.name}</div>
            <div className="text-sm text-gray-500">Click thumbnail to view full size</div>
            <button
              onClick={handleDownload}
              className="text-sm text-blue-600 hover:text-blue-800 underline mt-1"
            >
              Download Image
            </button>
          </div>
        </div>
        <ImageModal
          src={file.url}
          alt={file.name}
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
        />
      </div>
    )
  }

  if (isAudio) {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-blue-600">🎵 {file.name}</span>
        </div>
        <audio controls className="w-full max-w-md">
          <source src={file.url} type={file.file_type || 'audio/wav'} />
          Your browser does not support the audio element.
        </audio>
        <button
          onClick={handleDownload}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Download Audio
        </button>
      </div>
    )
  }

  // Regular file
  return (
    <div className="flex items-center space-x-2">
      <span className="text-blue-600">📎 {file.name}</span>
      <button
        onClick={handleDownload}
        className="text-blue-600 hover:text-blue-800 text-sm underline"
      >
        {isBase64 ? 'Download' : 'Open File'}
      </button>
    </div>
  )
}

export const ResponseFieldDisplay: React.FC<ResponseFieldDisplayProps> = ({ field, value }) => {
  const [signatureModalOpen, setSignatureModalOpen] = useState(false)

  if (value === null || value === undefined || value === '') {
    return <span className="text-gray-400 italic">No answer</span>
  }

  const renderValue = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'textarea':
      case 'number':
      case 'date':
        return <span className="text-gray-900">{String(value)}</span>

      case 'select':
      case 'radio':
        return <span className="text-gray-900 bg-blue-50 px-2 py-1 rounded text-sm">{String(value)}</span>

      case 'checkbox':
      case 'yesno':
      case 'task':
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
            value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {value ? '✅ Yes' : '❌ No'}
          </span>
        )

      case 'rating':
        const rating = Number(value) || 0
        const maxRating = field.max || 5
        const getRatingIcon = (index: number) => {
          const isActive = index < rating
          switch (field.rating_type) {
            case 'hearts':
              return isActive ? '❤️' : '🤍'
            case 'thumbs':
              return isActive ? '👍' : '👎'
            case 'numbers':
              return index + 1
            default:
              return isActive ? '⭐' : '☆'
          }
        }
        
        return (
          <div className="flex items-center space-x-1">
            {Array.from({ length: maxRating }, (_, index) => (
              <span key={index} className="text-lg">
                {getRatingIcon(index)}
              </span>
            ))}
            <span className="ml-2 text-sm text-gray-600">({rating}/{maxRating})</span>
          </div>
        )

      case 'slider':
        return (
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {value}
            </div>
            <span className="text-sm text-gray-500">
              (Range: {field.slider_min || 0} - {field.slider_max || 100})
            </span>
          </div>
        )

      case 'file':
      case 'image':
      case 'audio':
        if (typeof value === 'object' && value.name && value.url) {
          return <FileDisplay file={value} fieldType={field.type} />
        } else if (Array.isArray(value)) {
          return (
            <div className="space-y-3">
              {value.map((file: any, index: number) => (
                <FileDisplay key={index} file={file} fieldType={field.type} />
              ))}
            </div>
          )
        }
        return <span className="text-gray-900">{String(value)}</span>

      case 'signature':
        if (typeof value === 'string' && value.startsWith('data:image')) {
          return (
            <div className="space-y-2">
              <div 
                className="cursor-pointer border border-gray-300 rounded max-w-xs hover:shadow-md transition-shadow"
                onClick={() => setSignatureModalOpen(true)}
              >
                <img 
                  src={value} 
                  alt="Signature" 
                  className="max-w-full h-auto"
                />
              </div>
              <div className="text-sm text-gray-500">Digital signature (click to enlarge)</div>
              <ImageModal
                src={value}
                alt="Digital Signature"
                isOpen={signatureModalOpen}
                onClose={() => setSignatureModalOpen(false)}
              />
            </div>
          )
        }
        return <span className="text-gray-900">{String(value)}</span>

      case 'location':
        if (typeof value === 'object' && value.address) {
          return (
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <span className="text-gray-900">📍 {value.address}</span>
              </div>
              {value.latitude && value.longitude && (
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">
                    Coordinates: {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${value.latitude},${value.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    View on Google Maps
                  </a>
                </div>
              )}
            </div>
          )
        }
        return <span className="text-gray-900">{String(value)}</span>

      case 'imageselection':
        if (Array.isArray(value)) {
          return (
            <div className="space-y-3">
              <div className="text-sm text-gray-600 mb-2">
                Selected {value.length} image{value.length !== 1 ? 's' : ''}:
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {value.map((imageData: string, index: number) => (
                  <ImageThumbnail key={index} imageData={imageData} index={index} />
                ))}
              </div>
            </div>
          )
        }
        return <ImageThumbnail imageData={String(value)} index={0} />

      case 'scanner':
        return (
          <div className="flex items-center space-x-2">
            <span className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">📷 {String(value)}</span>
            <span className="text-sm text-gray-500">Scanned code</span>
          </div>
        )

      default:
        return <span className="text-gray-900">{String(value)}</span>
    }
  }

  return (
    <div className="space-y-1">
      {renderValue()}
    </div>
  )
}

export default ResponseFieldDisplay 