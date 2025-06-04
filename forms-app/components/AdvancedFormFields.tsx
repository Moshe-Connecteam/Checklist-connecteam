'use client'

import React, { useState, useRef, useEffect } from 'react'
import { FormField } from '../lib/supabase'

interface AdvancedFormFieldProps {
  field: FormField
  value: any
  onChange: (value: any) => void
  onFileUpload?: (file: File, fieldId: string) => Promise<string>
  disabled?: boolean
  error?: string
}

export const AdvancedFormField: React.FC<AdvancedFormFieldProps> = ({
  field,
  value,
  onChange,
  onFileUpload,
  disabled = false,
  error
}) => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={field.type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            required={field.required}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || '')}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            disabled={disabled}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )

      case 'date':
        // Use today's date as default if no value is provided
        const getTodayDate = () => {
          const today = new Date()
          return today.toISOString().split('T')[0]
        }
        
        return (
          <input
            type="date"
            value={value || field.placeholder || getTodayDate()}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select an option...</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={disabled}
                  required={field.required}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )

      case 'checkbox':
        return (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled}
              required={field.required}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span>{field.label}</span>
          </label>
        )

      case 'yesno':
        return (
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={field.id}
                value="yes"
                checked={value === 'yes'}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                required={field.required}
                className="text-green-600 focus:ring-green-500"
              />
              <span className="text-green-600">✅ Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={field.id}
                value="no"
                checked={value === 'no'}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                required={field.required}
                className="text-red-600 focus:ring-red-500"
              />
              <span className="text-red-600">❌ No</span>
            </label>
          </div>
        )

      case 'rating':
        return (
          <RatingField
            field={field}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        )

      case 'slider':
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={field.slider_min || 0}
              max={field.slider_max || 100}
              step={field.slider_step || 1}
              value={value || field.slider_min || 0}
              onChange={(e) => onChange(parseFloat(e.target.value))}
              disabled={disabled}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{field.slider_min || 0}</span>
              <span className="font-medium text-blue-600">{value || field.slider_min || 0}</span>
              <span>{field.slider_max || 100}</span>
            </div>
          </div>
        )

      case 'file':
      case 'image':
        return (
          <FileUploadField
            field={field}
            value={value}
            onChange={onChange}
            onFileUpload={onFileUpload}
            disabled={disabled}
          />
        )

      case 'audio':
        return (
          <AudioRecordingField
            field={field}
            value={value}
            onChange={onChange}
            onFileUpload={onFileUpload}
            disabled={disabled}
          />
        )

      case 'signature':
        return (
          <SignatureField
            field={field}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        )

      case 'location':
        return (
          <LocationField
            field={field}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        )

      case 'imageselection':
        return (
          <ImageSelectionField
            field={field}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        )

      case 'task':
        return (
          <TaskField
            field={field}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        )

      case 'scanner':
        return (
          <ScannerField
            field={field}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        )

      default:
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">Field type "{field.type}" not yet implemented</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

// Rating Field Component
const RatingField: React.FC<{
  field: FormField
  value: any
  onChange: (value: any) => void
  disabled: boolean
}> = ({ field, value, onChange, disabled }) => {
  const rating = value || 0
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
    <div className="flex space-x-1">
      {Array.from({ length: maxRating }, (_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => !disabled && onChange(index + 1)}
          disabled={disabled}
          className={`text-2xl hover:scale-110 transition-transform ${
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          }`}
        >
          {getRatingIcon(index)}
        </button>
      ))}
    </div>
  )
}

// File Upload Field Component
const FileUploadField: React.FC<{
  field: FormField
  value: any
  onChange: (value: any) => void
  onFileUpload?: (file: File, fieldId: string) => Promise<string>
  disabled: boolean
}> = ({ field, value, onChange, onFileUpload, disabled }) => {
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0 || !onFileUpload) return

    setUploading(true)
    try {
      if (field.multiple) {
        const urls = []
        for (let i = 0; i < files.length; i++) {
          const url = await onFileUpload(files[i], field.id)
          urls.push({ name: files[i].name, url })
        }
        onChange(urls)
      } else {
        const url = await onFileUpload(files[0], field.id)
        onChange({ name: files[0].name, url })
      }
    } catch (error) {
      console.error('File upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept={field.accept}
        multiple={field.multiple}
        onChange={handleFileUpload}
        disabled={disabled || uploading}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {uploading && (
        <p className="text-sm text-blue-600">Uploading...</p>
      )}
      {value && (
        <div className="text-sm text-gray-600">
          {field.multiple && Array.isArray(value) ? (
            <div>
              {value.map((file: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <span>📎 {file.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>📎 {value.name}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Audio Recording Field Component  
const AudioRecordingField: React.FC<{
  field: FormField
  value: any
  onChange: (value: any) => void
  onFileUpload?: (file: File, fieldId: string) => Promise<string>
  disabled: boolean
}> = ({ field, value, onChange, onFileUpload, disabled }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string>('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' })
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)

        if (onFileUpload) {
          const file = new File([audioBlob], `recording-${Date.now()}.wav`, { type: 'audio/wav' })
          try {
            const uploadedUrl = await onFileUpload(file, field.id)
            onChange({ name: file.name, url: uploadedUrl })
          } catch (error) {
            console.error('Audio upload error:', error)
          }
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled}
          className={`px-4 py-2 rounded-md ${
            isRecording
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          } disabled:opacity-50`}
        >
          {isRecording ? '🛑 Stop Recording' : '🎤 Start Recording'}
        </button>
      </div>
      {audioURL && (
        <audio controls className="w-full">
          <source src={audioURL} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
      {value && (
        <div className="text-sm text-gray-600">
          <span>🎵 {value.name}</span>
        </div>
      )}
    </div>
  )
}

// Signature Field Component
const SignatureField: React.FC<{
  field: FormField
  value: any
  onChange: (value: any) => void
  disabled: boolean
}> = ({ field, value, onChange, disabled }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) return
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      const canvas = canvasRef.current
      if (canvas) {
        const dataURL = canvas.toDataURL()
        onChange(dataURL)
      }
    }
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        onChange('')
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.strokeStyle = '#000'
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
      }
    }
  }, [])

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border-2 border-gray-300 rounded-md cursor-crosshair bg-white"
        style={{ touchAction: 'none' }}
      />
      <button
        type="button"
        onClick={clearSignature}
        disabled={disabled}
        className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
      >
        Clear Signature
      </button>
    </div>
  )
}

// Location Field Component
const LocationField: React.FC<{
  field: FormField
  value: any
  onChange: (value: any) => void
  disabled: boolean
}> = ({ field, value, onChange, disabled }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [showManualEntry, setShowManualEntry] = useState(false)

  const getCurrentLocation = () => {
    if (disabled) return
    
    setLoading(true)
    setError('')
    
    // Check if we're on HTTPS or localhost
    const isSecureContext = location.protocol === 'https:' || location.hostname === 'localhost'
    
    if (!isSecureContext) {
      setError('Location requires HTTPS. Please use manual entry.')
      setLoading(false)
      setShowManualEntry(true)
      return
    }
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      setLoading(false)
      setShowManualEntry(true)
      return
    }

    console.log('Requesting geolocation...')
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Geolocation success:', position)
        const { latitude, longitude } = position.coords
        const locationData = {
          latitude,
          longitude,
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        }
        onChange(locationData)
        setLoading(false)
        setError('')
      },
      (error) => {
        console.log('Geolocation error:', error)
        let errorMessage = 'Unable to get location. '
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Permission denied. Please allow location access or enter manually.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information unavailable.'
            break
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.'
            break
          default:
            errorMessage += 'An unknown error occurred.'
            break
        }
        setError(errorMessage)
        setLoading(false)
        setShowManualEntry(true)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000
      }
    )
  }

  const handleAddressChange = (newAddress: string) => {
    if (value && typeof value === 'object') {
      onChange({ ...value, address: newAddress })
    } else {
      onChange({ address: newAddress })
    }
  }

  const handleManualCoordinates = (lat: string, lng: string) => {
    const latitude = parseFloat(lat)
    const longitude = parseFloat(lng)
    
    if (!isNaN(latitude) && !isNaN(longitude)) {
      const locationData = {
        latitude,
        longitude,
        address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      }
      onChange(locationData)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <input
          type="text"
          value={value?.address || ''}
          onChange={(e) => handleAddressChange(e.target.value)}
          placeholder="Enter address or use location button"
          disabled={disabled}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={disabled || loading}
          className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 min-w-[48px]"
          title="Get current location"
        >
          {loading ? '⏳' : '🗺️'}
        </button>
        <button
          type="button"
          onClick={() => setShowManualEntry(!showManualEntry)}
          disabled={disabled}
          className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
          title="Enter coordinates manually"
        >
          📍
        </button>
      </div>
      
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
      
      {showManualEntry && (
        <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Manual Coordinates Entry</h4>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Latitude"
              step="any"
              className="px-2 py-1 border border-gray-300 rounded text-sm"
              onChange={(e) => {
                const lng = value?.longitude || ''
                handleManualCoordinates(e.target.value, lng.toString())
              }}
            />
            <input
              type="number"
              placeholder="Longitude"
              step="any"
              className="px-2 py-1 border border-gray-300 rounded text-sm"
              onChange={(e) => {
                const lat = value?.latitude || ''
                handleManualCoordinates(lat.toString(), e.target.value)
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            You can get coordinates from Google Maps or other mapping services
          </p>
        </div>
      )}
      
      {value?.latitude && value?.longitude && (
        <div className="text-sm text-gray-600 bg-green-50 p-2 rounded space-y-1">
          <p>✅ Location: {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}</p>
          <a
            href={`https://www.google.com/maps?q=${value.latitude},${value.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            View on Google Maps
          </a>
        </div>
      )}
    </div>
  )
}

// Image Selection Field Component
const ImageSelectionField: React.FC<{
  field: FormField
  value: any
  onChange: (value: any) => void
  disabled: boolean
}> = ({ field, value, onChange, disabled }) => {
  if (!field.options || field.options.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-gray-400 text-4xl mb-2">🖼️</div>
        <p className="text-gray-500">No images available for selection</p>
        <p className="text-xs text-gray-400 mt-1">Form creator needs to upload images in the form builder</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">
        {field.multiple ? 'Select one or more images:' : 'Select an image:'}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {field.options.map((imageData, index) => {
          const isSelected = field.multiple 
            ? Array.isArray(value) && value.includes(imageData)
            : value === imageData
            
          return (
            <label key={index} className="cursor-pointer group">
              <input
                type={field.multiple ? "checkbox" : "radio"}
                name={field.id}
                value={imageData}
                checked={isSelected}
                onChange={(e) => {
                  if (field.multiple) {
                    const currentValue = Array.isArray(value) ? value : []
                    if (e.target.checked) {
                      onChange([...currentValue, imageData])
                    } else {
                      onChange(currentValue.filter(v => v !== imageData))
                    }
                  } else {
                    onChange(e.target.value)
                  }
                }}
                disabled={disabled}
                className="sr-only"
              />
              <div className={`
                relative border-3 rounded-lg overflow-hidden transition-all transform
                ${isSelected
                  ? 'border-blue-500 ring-2 ring-blue-200 scale-105' 
                  : 'border-gray-300 hover:border-gray-400 group-hover:scale-102'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}>
                <img 
                  src={imageData} 
                  alt={`Option ${index + 1}`}
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
                
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {field.multiple ? '✓' : '●'}
                  </div>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200"></div>
              </div>
            </label>
          )
        })}
      </div>
      
      {/* Selected count for multiple selection */}
      {field.multiple && Array.isArray(value) && value.length > 0 && (
        <p className="text-sm text-blue-600 font-medium">
          {value.length} image{value.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  )
}

// Task Field Component
const TaskField: React.FC<{
  field: FormField
  value: any
  onChange: (value: any) => void
  disabled: boolean
}> = ({ field, value, onChange, disabled }) => {
  return (
    <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-md hover:bg-gray-50">
      <input
        type="checkbox"
        checked={value || false}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="text-green-600 focus:ring-green-500 h-5 w-5"
      />
      <span className="flex-1 text-gray-700">
        Mark as completed when done
      </span>
      <span className="text-2xl">
        {value ? '✅' : '⏳'}
      </span>
    </label>
  )
}

// Scanner Field Component
const ScannerField: React.FC<{
  field: FormField
  value: any
  onChange: (value: any) => void
  disabled: boolean
}> = ({ field, value, onChange, disabled }) => {
  const [scanning, setScanning] = useState(false)

  const startScanning = () => {
    if (disabled) return
    setScanning(true)
    // In a real implementation, you would integrate with a QR/barcode scanning library
    // For now, we'll simulate scanning
    setTimeout(() => {
      onChange(`SCANNED_${Date.now()}`)
      setScanning(false)
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Scanned code will appear here..."
          disabled={disabled}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={startScanning}
          disabled={disabled || scanning}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
        >
          {scanning ? '📷 Scanning...' : '📷 Scan'}
        </button>
      </div>
      {scanning && (
        <div className="text-center p-8 bg-gray-100 rounded-md">
          <div className="text-4xl mb-2">📷</div>
          <p className="text-gray-600">Point camera at QR code or barcode...</p>
        </div>
      )}
    </div>
  )
}

export default AdvancedFormField 