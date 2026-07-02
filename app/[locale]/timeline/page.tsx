'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { MatchEvent } from '@/lib/supabase'
import EventCard from '@/components/EventCard'
import Nav from '@/components/Nav'

export default function TimelinePage() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('timeline')
  const tn = useTranslations('nav')

  const [prenom, setPrenom] = useState('')
  const [userDays, setUserDays] = useState(0)
  const [birthdate, setBirthdate] = useState('')
  const [ageLabel, setAgeLabel] = useState('')
  const [events, setEvents] = useState<MatchEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [subscribeStatus, setSubscribeStatus] = useState<'idle'|'loading'|'done'|'error'>('idle')
  const [copied, setCopied] = useState(false)

  const CATEGORIES = [
    { slug: null,          label: t('filters.all') },
    { slug: 'arts',        label: t('filters.arts') },
    { slug: 'science',     label: t('filters.science') },
    { slug: 'sport',       label: t('filters.sport') },
    { slug: 'pouvoir',     label: t('filters.politique') },
    { slug: 'exploration', label: t('filters.exploration') },
  ]

  useEffect(() => {
    const p = localStorage.getItem('ch_prenom')
    const bd = localStorage.getItem('ch_birthdate')
    const ud = localStorage.getItem('ch_userdays')
    if (!p || !bd || !ud) { router.push(`/${locale}`); return }
    setPrenom(p)
    setBirthdate(bd)
    setUserDays(Number(ud))
    const birth = new Date(bd)
    const today = new Date()
    let y = today.getFullYear() - birth.getFullYear()
    let m = today.getMonth() - birth.getMonth()
    let d = today.getDate() - birth.getDate()
    if (d < 0) { m -= 1; d += new Date(today.getFullYear(), today.getMonth(), 0).getDate() }
    if (m < 0) { y -= 1; m += 12 }
    setAgeLabel(y + ' ' + t('years') + ', ' + m + ' ' + t('months') + ' et ' + d + ' ' + (d > 1 ? t('days') : t('day1')))
  }, [])

  useEffect(() => {
    if (!userDays) return
    setLoading(true)
    setError('')
    const url = '/api/match?days=' + userDays + '&window=60' + (cat ? '&category=' + cat : '') + '&limit=20'
    fetch(url).then(r => r.json()).then(d => {
      if (d.error) { setError(d.error); setLoading(false); return }
      setEvents(d.events ?? [])
      setLoading(false)
    }).catch(() => { setError('Erreur de connexion'); setLoading(false) })
  }, [userDays, cat])

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubscribeStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, prenom, birthdate, userDays })
      })
      const data = await res.json()
      if (data.success) setSubscribeStatus('done')
      else setSubscribeStatus('error')
    } catch {
      setSubscribeStatus('error')
    }
  }

  function handleShare() {
    const shareUrl = 'https://chronoheroes.com?prenom=' + encodeURIComponent(prenom) + '&birth=' + birthdate
    const shareText = prenom + ' a ' + ageLabel + ' de vie. Decouvrez sa perspective historique sur ChronoHeroes : ' + shareUrl
    if (navigator.share) {
      navigator.share({ title: 'Ma perspective historique', text: shareText, url: shareUrl })
    } else {
      navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f5f3ee', fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '0.5px solid #e8e6e0', background: '#ffffff', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => router.push(`/${locale}`)}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="#b8860b" strokeWidth="1.5"/>
            <circle cx="14" cy="14" r="3" fill="#b8860b"/>
            <line x1="14" y1="2" x2="14" y2="8" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="14" y1="20" x2="14" y2="26" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="2" y1="14" x2="8" y2="14" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="20" y1="14" x2="26" y2="14" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#1a1916' }}>{tn('brand')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span onClick={() => router.push(locale === 'fr' ? '/en' : '/fr')} style={{ fontSize: 12, color: '#b8860b', cursor: 'pointer', fontWeight: 600 }}>
            {locale === 'fr' ? 'EN' : 'FR'}
          </span>
          <span onClick={() => router.push(`/${locale}/about`)} style={{ fontSize: 13, color: '#6b6a65', cursor: 'pointer' }}>{tn('howItWorks')}</span>
          <button onClick={() => router.push(`/${locale}`)} style={{ fontSize: 12, color: '#6b6a65', background: 'transparent', border: '0.5px solid #e8e6e0', borderRadius: 99, padding: '6px 14px', cursor: 'pointer', fontFamily: 'sans-serif' }}>
            Retour
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 620, margin: '0 auto', padding: '0 16px 80px' }}>
        <div style={{ background: '#ffffff', border: '0.5px solid #e8e6e0', borderRadius: 14, padding: '20px 24px', margin: '24px 0 8px', textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#a8a79f', marginBottom: 6 }}>{t('yourAge')}{prenom ? ' · ' + prenom : ''}</div>
          <div style={{ fontSize: 34, fontWeight: 700, color: '#1a1916', letterSpacing: '-1px' }}>{userDays.toLocaleString('fr-FR')} {t('days')}</div>
          <div style={{ fontSize: 13, color: '#6b6a65', marginTop: 6 }}>{ageLabel}</div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 15, color: '#b8860b', fontStyle: 'italic', fontWeight: 500 }}>
            {t('tagline')}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {CATEGORIES.map(c => (
            <button key={String(c.slug)} onClick={() => setCat(c.slug)} style={{ padding: '5px 13px', fontSize: 12, borderRadius: 99, cursor: 'pointer', fontFamily: 'sans-serif', background: cat === c.slug ? '#1a1916' : 'transparent', color: cat === c.slug ? '#ffffff' : '#6b6a65', border: cat === c.slug ? '0.5px solid #1a1916' : '0.5px solid #d0cec8', fontWeight: cat === c.slug ? 600 : 400 }}>
              {c.label}
            </button>
          ))}
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '60px 0', color: '#a8a79f', fontSize: 13 }}>Recherche en cours...</div>}
        {error && <div style={{ background: '#fef3e2', border: '0.5px solid #b8860b', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#b8860b' }}>{error}</div>}
        {!loading && !error && events.length === 0 && (
          <div style={{ background: '#ffffff', border: '0.5px solid #e8e6e0', borderRadius: 12, padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#6b6a65', marginBottom: 12 }}>{t('noResults')}</div>
            <button onClick={() => setCat(null)} style={{ fontSize: 12, padding: '7px 16px', border: '0.5px solid #e8e6e0', borderRadius: 99, background: 'transparent', cursor: 'pointer', color: '#1a1916', fontFamily: 'sans-serif' }}>{t('filters.all')}</button>
          </div>
        )}

        {!loading && events.map((event, index) => (
  <React.Fragment key={event.event_id}>
    <EventCard key={event.event_id} event={event} />
    {index === 4 && (
      <div style={{ background: '#ffffff', border: '0.5px solid #e8e6e0', borderRadius: 14, padding: '24px', marginBottom: 12 }}>
        {subscribeStatus === 'done' ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>✓</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1916', marginBottom: 6 }}>{t('subscribeDone')}</div>
            <div style={{ fontSize: 13, color: '#6b6a65' }}>{t('subscribeDoneText')}</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 15, color: '#1a1916', marginBottom: 4, textAlign: 'center' }}>
              <span style={{ fontWeight: 700, display: 'block' }}>{t('subscribeTitleBold')}</span>
              <span style={{ fontWeight: 400 }}>{t('subscribeTitleLight')}</span>
            </div>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)}
                style={{ flex: 1, minWidth: 200, padding: '10px 14px', fontSize: 14, background: '#f5f3ee', border: '0.5px solid #e8e6e0', borderRadius: 8, outline: 'none', color: '#1a1916', fontFamily: 'sans-serif' }} />
              <button type="submit" disabled={subscribeStatus === 'loading'}
                style={{ padding: '10px 20px', background: '#b8860b', color: '#ffffff', border: 'none', borderRadius: 99, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif', whiteSpace: 'nowrap' }}>
                {subscribeStatus === 'loading' ? '...' : t('subscribeButton')}
              </button>
            </form>
            {subscribeStatus === 'error' && <div style={{ fontSize: 12, color: '#E24B4A', marginTop: 8 }}>Une erreur est survenue.</div>}
            <div style={{ fontSize: 11, color: '#a8a79f', marginTop: 10, textAlign: 'center' }}>{t('noSpam')}</div>
          </>
        )}
      </div>
    )}
    </React.Fragment>
    ))}

        {!loading && events.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 12, marginBottom: 20 }}>
            <button onClick={() => {
              const url = '/api/match?days=' + userDays + '&window=120' + (cat ? '&category=' + cat : '') + '&limit=40'
              setLoading(true)
              fetch(url).then(r => r.json()).then(d => { setEvents(d.events ?? []); setLoading(false) })
            }} style={{ fontSize: 13, padding: '9px 22px', border: '0.5px solid #e8e6e0', borderRadius: 99, background: 'transparent', cursor: 'pointer', color: '#1a1916', fontFamily: 'sans-serif' }}>
              {t('seeMore')}
            </button>
          </div>
        )}

        {!loading && (
          <div style={{ background: '#ffffff', border: '0.5px solid #e8e6e0', borderRadius: 14, padding: '24px', marginBottom: 12 }}>
            {subscribeStatus === 'done' ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>✓</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1916', marginBottom: 6 }}>{t('subscribeDone')}</div>
                <div style={{ fontSize: 13, color: '#6b6a65' }}>{t('subscribeDoneText')}</div>
              </div>
            ) : (
              <>
               <div style={{ fontSize: 15, color: '#1a1916', marginBottom: 4, textAlign: 'center' }}>
               <span style={{ fontWeight: 700, display: 'block' }}>{t('subscribeTitleBold')}</span>
               <span style={{ fontWeight: 400 }}>{t('subscribeTitleLight')}</span>
               </div>
                 
                <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)}
                    style={{ flex: 1, minWidth: 200, padding: '10px 14px', fontSize: 14, background: '#f5f3ee', border: '0.5px solid #e8e6e0', borderRadius: 8, outline: 'none', color: '#1a1916', fontFamily: 'sans-serif' }} />
                  <button type="submit" disabled={subscribeStatus === 'loading'}
                    style={{ padding: '10px 20px', background: '#b8860b', color: '#ffffff', border: 'none', borderRadius: 99, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif', whiteSpace: 'nowrap' }}>
                    {subscribeStatus === 'loading' ? '...' : t('subscribeButton')}
                  </button>
                </form>
                {subscribeStatus === 'error' && <div style={{ fontSize: 12, color: '#E24B4A', marginTop: 8 }}>Une erreur est survenue.</div>}
                <div style={{ fontSize: 11, color: '#a8a79f', marginTop: 10 }}>{t('noSpam') ?? 'Gratuit · Sans spam · Desinscription en un clic'}</div>
              </>
            )}
          </div>
        )}

        {!loading && (
          <div style={{ background: '#ffffff', border: '0.5px solid #e8e6e0', borderRadius: 14, padding: '20px 24px', marginBottom: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1916', marginBottom: 6 }}>Partager ma perspective</div>
            <div style={{ fontSize: 13, color: '#6b6a65', marginBottom: 16, lineHeight: 1.6 }}>
              Invitez quelqu'un a decouvrir votre perspective historique personnelle.
            </div>
            <button onClick={handleShare} style={{ padding: '10px 24px', background: '#1a1916', color: '#ffffff', border: 'none', borderRadius: 99, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif' }}>
              {copied ? 'Lien copie !' : 'Partager ma perspective'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
