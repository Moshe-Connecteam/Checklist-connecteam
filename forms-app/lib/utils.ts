import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate URL-friendly slug from form title and ID
export function generateFormSlug(title: string, id: string): string {
  // Create slug from title
  const titleSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, 50) // Limit length
  
  // Get first 4 characters of ID
  const shortId = id.substring(0, 4)
  
  // Combine title slug with short ID
  const slug = titleSlug ? `${titleSlug}-${shortId}` : `form-${shortId}`
  
  return slug
}

// Extract original ID from slug
export function extractIdFromSlug(slug: string): string | null {
  // Extract the last 4 characters after the last hyphen
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]
  
  // Validate it's 4 characters (could be alphanumeric from UUID)
  if (lastPart && lastPart.length === 4) {
    return lastPart
  }
  
  return null
}

// Validate if a string looks like a UUID
export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

// Convert slug back to search pattern for database lookup
export function getSearchPatternFromSlug(slug: string): string {
  const shortId = extractIdFromSlug(slug)
  return shortId ? `${shortId}%` : slug
}
