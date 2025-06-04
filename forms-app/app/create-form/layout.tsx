import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Forms | FormCraft - Choose Your Form Creation Method',
  description: 'Create professional forms using multiple methods: manual drag-and-drop builder, AI text-to-form generator, or AI image-to-form converter. Choose what works best for you.',
  keywords: 'create forms, form builder, AI form generator, drag and drop forms, online form creator, digital forms',
  openGraph: {
    title: 'Create Forms | FormCraft',
    description: 'Create professional forms using multiple methods: manual builder, AI text generator, or AI image converter.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Forms | FormCraft',
    description: 'Create professional forms using multiple methods: manual builder, AI text generator, or AI image converter.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/create-form'
  }
}

export default function CreateFormLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 