import type { Metadata } from 'next'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import Navigation from '../components/Navigation'

export const metadata: Metadata = {
  title: {
    default: 'FormCraft - Create Amazing Forms with AI & Drag-and-Drop Builder',
    template: '%s | FormCraft'
  },
  description: 'Build beautiful, interactive forms in seconds with AI-powered generation or drag-and-drop builder. Create contact forms, surveys, registrations, and more with advanced field types and real-time responses.',
  keywords: 'form builder, AI form generator, online forms, survey creator, contact forms, drag and drop, form templates, digital forms, web forms, form responses',
  authors: [{ name: 'FormCraft Team' }],
  creator: 'FormCraft',
  publisher: 'FormCraft',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://formcraft.com',
    title: 'FormCraft - Create Amazing Forms with AI',
    description: 'Build beautiful, interactive forms in seconds with AI-powered generation or drag-and-drop builder.',
    siteName: 'FormCraft',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FormCraft - Create Amazing Forms with AI',
    description: 'Build beautiful, interactive forms in seconds with AI-powered generation or drag-and-drop builder.',
    creator: '@formcraft',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#8B5CF6" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body>
          <Navigation />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
