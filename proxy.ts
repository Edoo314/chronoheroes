import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirection 301 : anciennes URLs /en/personnage/* déjà indexées → /en/character/*
  const match = pathname.match(/^\/en\/personnage\/(.+)$/)
  if (match) {
    return NextResponse.redirect(new URL(`/en/character/${match[1]}`, request.url), 301)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
