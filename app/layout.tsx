import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'ChronoHeroes — L Histoire a votre age exact',
  description: 'Chaque jour, decouvrez des evenements qui ont fait l Histoire dans votre perspective personnelle. Qui avait votre age lors des grands moments de l Histoire ?',
  icons: { icon: '/icon.svg' },
  openGraph: {
    title: 'ChronoHeroes — L Histoire a votre age exact',
    description: 'Decouvrez ce que les grands personnages historiques faisaient a votre age exact.',
    url: 'https://chronoheroes.com',
    siteName: 'ChronoHeroes',
    locale: 'fr_FR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}