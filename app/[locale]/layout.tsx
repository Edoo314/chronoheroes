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
  title: "ChronoHeroes — L'Histoire a votre age exact",
  description: "Chaque jour, decouvrez des evenements qui ont fait l'Histoire dans votre perspective personnelle.",
  icons: { icon: '/icon.svg' },
  openGraph: {
    title: "ChronoHeroes — L'Histoire a votre age exact",
    description: "Decouvrez ce que les grands personnages historiques faisaient a votre age exact.",
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
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
