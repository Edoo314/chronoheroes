import type { Metadata, Viewport } from 'next'
import '../globals.css'
import { Analytics } from '@vercel/analytics/react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'

const locales = ['fr', 'en']

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}
export const metadata: Metadata = {
  title: "ChronoHeroes — L'Histoire à votre âge exact",
  description: "Découvrez ce que les grands personnages historiques faisaient à votre âge exact, au jour près. 600+ personnages, 3000+ événements.",
  icons: { icon: '/icon.svg' },
  openGraph: {
    title: "ChronoHeroes — L'Histoire à votre âge exact",
    description: "Découvrez ce que les grands personnages historiques faisaient à votre âge exact, au jour près.",
    url: 'https://chronoheroes.com',
    siteName: 'ChronoHeroes',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale)) notFound()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
