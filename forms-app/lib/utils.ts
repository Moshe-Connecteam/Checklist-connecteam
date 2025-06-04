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
  
  // Use full UUID for reliability
  const fullId = id
  
  // Combine title slug with full ID
  const slug = titleSlug ? `${titleSlug}-${fullId}` : `form-${fullId}`
  
  return slug
}

// Extract original ID from slug
export function extractIdFromSlug(slug: string): string | null {
  console.log('🔍 Extracting ID from slug:', slug)
  
  if (!slug || typeof slug !== 'string') {
    console.log('❌ Invalid slug type:', typeof slug, slug)
    return null
  }
  
  // Split by hyphens and look for a UUID pattern (8-4-4-4-12 characters)
  const parts = slug.split('-')
  console.log('🔍 Slug parts:', parts)
  
  // Look for UUID pattern: 8-4-4-4-12 characters
  for (let i = 0; i < parts.length - 4; i++) {
    const potentialUuid = parts.slice(i, i + 5).join('-')
    if (isValidUUID(potentialUuid)) {
      console.log('✅ Extracted full UUID:', potentialUuid)
      return potentialUuid
    }
  }
  
  console.log('❌ No valid UUID found in slug')
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
