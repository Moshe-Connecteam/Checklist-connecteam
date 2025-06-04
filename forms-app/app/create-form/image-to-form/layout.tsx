import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Image to Form Generator | FormCraft - Create Forms from Images',
  description: 'Transform any image into a digital form with AI. Upload screenshots of forms, hand-drawn sketches, or documents and watch AI recreate them as interactive digital forms.',
  keywords: 'AI image to form, OCR form generator, image form conversion, scan to form, AI form recognition, automatic form digitization, visual form builder',
  openGraph: {
    title: 'AI Image to Form Generator | FormCraft',
    description: 'Transform any image into a digital form with AI. Upload screenshots, sketches, or documents.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Image to Form Generator | FormCraft',
    description: 'Transform any image into a digital form with AI. Upload screenshots, sketches, or documents.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/create-form/image-to-form'
  }
}

export default function ImageToFormLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 