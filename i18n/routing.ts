import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/personnage/[slug]': {
      fr: '/personnage/[slug]',
      en: '/character/[slug]'
    }
    // ajoute ici tes autres routes localisées si tu en as (ex: '/stats', '/a-propos'...)
  }
})