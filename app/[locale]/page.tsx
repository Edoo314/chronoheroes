'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { computeUserDays } from '@/lib/supabase'
import Nav from '@/components/Nav'
export default function HomePage() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('home')
  const tn = useTranslations('nav')
  const tf = useTranslations('footer')

  const [prenom, setPrenom] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [error, setError] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<'idle'|'loading'|'done'|'error'>('idle')

  const months = t.raw('months') as string[]

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 600)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const p = params.get('prenom')
    const b = params.get('birth')
    if (p && b) {
      const { userDays } = computeUserDays(b)
      localStorage.setItem('ch_prenom', p || 'Vous')
      localStorage.setItem('ch_birthdate', b)
      localStorage.setItem('ch_userdays', String(userDays))
      router.push(`/${locale}/timeline`)
    }
  }, [])

  function validateAndSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!birthdate || birthdate.split('-').filter(Boolean).length < 3) {
      setError(t('errorDate')); return
    }
    const today = new Date()
    const birthDate = new Date(birthdate)
    if (birthDate > today) { setError(t('errorFuture')); return }
    const { userDays } = computeUserDays(birthdate)
    if (userDays > 44000) { setError(t('errorTooOld')); return }
    setError('')
    localStorage.setItem('ch_prenom', prenom.trim() || 'Vous')
    localStorage.setItem('ch_birthdate', birthdate)
    localStorage.setItem('ch_userdays', String(userDays))
    router.push(`/${locale}/timeline`)
  }

  async function handleHomeSubscribe(e?: React.FormEvent) {
    e?.preventDefault()
    if (!newsletterEmail || !birthdate) return
    setNewsletterStatus('loading')
    try {
      const { userDays } = computeUserDays(birthdate)
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail, prenom: prenom.trim() || 'Vous', birthdate, userDays })
      })
      const data = await res.json()
      if (data.success) setNewsletterStatus('done')
      else setNewsletterStatus('error')
    } catch {
      setNewsletterStatus('error')
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'sans-serif' }}>
      <Nav />
      <section style={{ maxWidth: 680, margin: '0 auto', padding: isMobile ? '40px 16px 48px' : '72px 24px 64px', textAlign: 'center' }}>
        <h1 style={{ fontSize: isMobile ? 28 : 42, fontWeight: 700, color: '#1a1916', lineHeight: 1.1, letterSpacing: isMobile ? '-0.5px' : '-1px', marginBottom: 20 }}>
          <span style={{ color: '#b8860b' }}>{t('title1')}</span><br />
          {t('title2')}<br />
          <span style={{ color: '#b8860b' }}>{t('title3')}</span>
        </h1>
        <p style={{ fontSize: isMobile ? 14 : 16, color: '#6b6a65', lineHeight: 1.75, maxWidth: 480, margin: '0 auto 32px' }}>
          {t('subtitle')}
        </p>
        <div id="form-section">
          <form onSubmit={validateAndSubmit} style={{ background: '#f5f3ee', border: '0.5px solid #e8e6e0', borderRadius: 16, padding: '24px 20px 20px', textAlign: 'left', maxWidth: 400, margin: '0 auto' }}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: '#6b6a65', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                {t('labelFirstname')} <span style={{ color: '#a8a79f', fontSize: 10, textTransform: 'none', letterSpacing: 0 }}>{t('labelFirstnameOptional')}</span>
              </label>
              <input
                type="text"
                placeholder={t('placeholderFirstname')}
                value={prenom}
                onChange={e => setPrenom(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', fontSize: 16, background: '#ffffff', border: '0.5px solid #e8e6e0', borderRadius: 8, outline: 'none', color: '#1a1916', fontFamily: 'sans-serif', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, color: '#6b6a65', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                {t('labelBirthdate')}
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select
                  value={birthdate ? birthdate.split('-')[2] : ''}
                  onChange={e => { const parts = birthdate ? birthdate.split('-') : ['', '', '']; setBirthdate(`${parts[0]}-${parts[1]}-${e.target.value}`) }}
                  style={{ flex: 1, padding: '12px 8px', fontSize: 15, background: '#ffffff', border: '0.5px solid #e8e6e0', borderRadius: 8, outline: 'none', color: '#1a1916', fontFamily: 'sans-serif', boxSizing: 'border-box', minWidth: 0 }}
                >
                  <option value="">{t('day')}</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={String(d).padStart(2, '0')}>{d}</option>
                  ))}
                </select>
                <select
                  value={birthdate ? birthdate.split('-')[1] : ''}
                  onChange={e => { const parts = birthdate ? birthdate.split('-') : ['', '', '']; setBirthdate(`${parts[0]}-${e.target.value}-${parts[2]}`) }}
                  style={{ flex: 2, padding: '12px 8px', fontSize: 15, background: '#ffffff', border: '0.5px solid #e8e6e0', borderRadius: 8, outline: 'none', color: '#1a1916', fontFamily: 'sans-serif', boxSizing: 'border-box', minWidth: 0 }}
                >
                  <option value="">{t('month')}</option>
                  {months.map((m: string, i: number) => (
                    <option key={i} value={String(i + 1).padStart(2, '0')}>{m}</option>
                  ))}
                </select>
                <select
                  value={birthdate ? birthdate.split('-')[0] : ''}
                  onChange={e => { const parts = birthdate ? birthdate.split('-') : ['', '', '']; setBirthdate(`${e.target.value}-${parts[1]}-${parts[2]}`) }}
                  style={{ flex: 2, padding: '12px 8px', fontSize: 15, background: '#ffffff', border: '0.5px solid #e8e6e0', borderRadius: 8, outline: 'none', color: '#1a1916', fontFamily: 'sans-serif', boxSizing: 'border-box', minWidth: 0 }}
                >
                  <option value="">{t('year')}</option>
                  {Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => new Date().getFullYear() - i).filter(y => y <= new Date().getFullYear() - 13).map(y => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            {error && (
              <div style={{ background: '#faf6ea', border: '0.5px solid #b8860b', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#b8860b', marginBottom: 14, lineHeight: 1.5 }}>
                {error}
              </div>
            )}
            <button type="submit" style={{ width: '100%', padding: '14px', background: '#1a1916', color: '#ffffff', border: 'none', borderRadius: 99, fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif', WebkitAppearance: 'none' }}>
              {t('submit')}
            </button>
            <p style={{ fontSize: 12, color: '#a8a79f', textAlign: 'center', marginTop: 12, marginBottom: 0 }}>{t('free')}</p>

            {birthdate && birthdate.split('-').filter(Boolean).length === 3 && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '0.5px solid #e8e6e0' }}>
                {newsletterStatus === 'done' ? (
                  <div style={{ background: '#f0f9f0', border: '0.5px solid #27500A', borderRadius: 12, padding: '18px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#27500A', marginBottom: 6 }}>{t('confirmTitle')}</div>
                    <div style={{ fontSize: 13, color: '#6b6a65', lineHeight: 1.6 }}>{t('confirmText')}</div>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: 12, color: '#6b6a65', marginBottom: 10, textAlign: 'center', lineHeight: 1.5 }}>
                    <span style={{ fontWeight: 700, color: '#1a1916', display: 'block' }}>{t('newsletterTitleBold')}</span>
                    <span>{t('newsletterTitleLight')}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <input type="email" placeholder="votre@email.com" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)}
                        style={{ flex: 1, padding: '10px 14px', fontSize: 14, background: '#ffffff', border: '0.5px solid #e8e6e0', borderRadius: 8, outline: 'none', color: '#1a1916', fontFamily: 'sans-serif', boxSizing: 'border-box', minWidth: 0 }} />
                      <button type="button" onClick={handleHomeSubscribe} disabled={newsletterStatus === 'loading'}
                        style={{ padding: '10px 16px', background: '#b8860b', color: '#ffffff', border: 'none', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif', whiteSpace: 'nowrap' }}>
                        {newsletterStatus === 'loading' ? '...' : t('subscribe')}
                      </button>
                    </div>
                    {newsletterStatus === 'error' && <div style={{ fontSize: 12, color: '#E24B4A', marginTop: 8 }}>Une erreur est survenue.</div>}
                    <div style={{ fontSize: 11, color: '#a8a79f', marginTop: 8, textAlign: 'center' }}>{t('noSpam')}</div>
                  </>
                )}
              </div>
            )}
          </form>
          <div style={{ display: 'inline-block', fontSize: 14, letterSpacing: '.08em', color: '#b8860b', marginTop: 28, marginBottom: 0, padding: '7px 20px', border: '0.5px solid #b8860b44', borderRadius: 99, fontWeight: 500 }}>
            {t('mirror')}
          </div>
        </div>
      </section>

      <footer style={{ borderTop: '0.5px solid #e8e6e0', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#a8a79f', background: '#f5f3ee', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ color: '#1a1916', fontWeight: 600 }}>{tn('brand')}</span>
        <span onClick={() => router.push(`/${locale}/about`)} style={{ cursor: 'pointer', color: '#6b6a65' }}>{tf('howItWorks')}</span>
        <span onClick={() => router.push(`/${locale}/stats`)} style={{ cursor: 'pointer', color: '#6b6a65' }}>{tf('statistics')}</span>
        <span>2026 - <a href="mailto:hero@chronoheroes.com" style={{ color: '#b8860b', textDecoration: 'none' }}>hero@chronoheroes.com</a></span>
      </footer>
    </main>
  )
}
