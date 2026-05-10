import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'ChronoHeroes - L Histoire a votre age exact',
  description: 'Decouvrez chaque jour ce que des personnages celebres ont accompli au meme age que vous, au jour pres.',
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
