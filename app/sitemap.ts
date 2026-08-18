import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Sans ça, Next.js met en cache le résultat de la requête Supabase de façon
// persistante (le cache survit même aux redéploiements) et sert un sitemap
// figé au lieu de refléter les personnes ajoutées depuis. Découvert le
// 18/08/2026 : les 16 personnes du lot "histoire politique anglaise du 20e
// siècle" étaient absentes du sitemap malgré plusieurs redéploiements.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: persons } = await supabase
    .from('persons')
    .select('wikipedia_slug')

  const personnageUrls = (persons ?? [])
    .filter(p => p.wikipedia_slug)
    .flatMap(p => [
      {
        url: `https://chronoheroes.com/fr/personnage/${p.wikipedia_slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `https://chronoheroes.com/en/personnage/${p.wikipedia_slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
    ])

  return [
    { url: 'https://chronoheroes.com/fr', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://chronoheroes.com/en', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://chronoheroes.com/fr/stats', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://chronoheroes.com/en/stats', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://chronoheroes.com/fr/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://chronoheroes.com/en/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...personnageUrls,
  ]
}