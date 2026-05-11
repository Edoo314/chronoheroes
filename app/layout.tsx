import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ChronoHeroes — L Histoire a votre age exact',
  description: 'Chaque jour, decouvrez des evenements qui ont fait l Histoire avec une perspective personnelle.',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
