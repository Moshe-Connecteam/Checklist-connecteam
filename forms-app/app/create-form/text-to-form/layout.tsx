import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Text to Form Generator | FormCraft - Create Forms from Text Descriptions',
  description: 'Generate professional forms instantly using AI. Simply describe your form in plain English and watch AI create it with all the right field types, validation, and user-friendly design.',
  keywords: 'AI form generator, text to form, automatic form creation, form builder, AI-powered forms, smart form creation, natural language forms',
  openGraph: {
    title: 'AI Text to Form Generator | FormCraft',
    description: 'Generate professional forms instantly using AI. Simply describe your form in plain English.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Text to Form Generator | FormCraft',
    description: 'Generate professional forms instantly using AI. Simply describe your form in plain English.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/create-form/text-to-form'
  }
}

export default function TextToFormLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 