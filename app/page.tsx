'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { computeUserDays } from '@/lib/supabase'

export default function HomePage() {
  const router = useRouter()
  const [prenom, setPrenom] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [error, setError] = useState('')
  const [isMobile, setIsMobile] = useState(false)

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
      localStorage.setItem('ch_prenom', p)
      localStorage.setItem('ch_birthdate', b)
      localStorage.setItem('ch_userdays', String(userDays))
      router.push('/timeline')
    }
  }, [])

  function validateAndSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prenom.trim()) { setError("Merci d'entrer votre prénom."); return }
    if (!birthdate) { setError("Merci d'entrer votre date de naissance."); return }
    const year = parseInt(birthdate.split('-')[0])
    const today = new Date()
    const birthDate = new Date(birthdate)
    if (year < 1900) { setError("Même Jeanne Calment n'est née qu'en 1875... Vérifiez !"); return }
    if (birthDate > today) { setError("Vous n'êtes pas encore né ! Revenez le " + birthDate.toLocaleDateString('fr-FR')); return }
    const { userDays } = computeUserDays(birthdate)
    if (userDays > 44000) { setError("Même Jeanne Calment n'a vécu que 122 ans. Vérifiez votre date !"); return }
    setError('')
    localStorage.setItem('ch_prenom', prenom.trim())
    localStorage.setItem('ch_birthdate', birthdate)
    localStorage.setItem('ch_userdays', String(userDays))
    router.push('/timeline')
  }

  return (
    <main style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '0.5px solid #e8e6e0', background: '#ffffff', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => router.push('/')}>
          <svg width="30" height="30" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="#b8860b" strokeWidth="1.5"/>
            <circle cx="14" cy="14" r="3" fill="#b8860b"/>
            <line x1="14" y1="2" x2="14" y2="8" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="14" y1="20" x2="14" y2="26" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="2" y1="14" x2="8" y2="14" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="20" y1="14" x2="26" y2="14" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#1a1916', letterSpacing: '-.3px' }}>ChronoHeroes</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {!isMobile && (
            <span onClick={() => router.push('/about')} style={{ fontSize: 13, color: '#6b6a65', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Comment ça marche
            </span>
          )}
          <span onClick={() => document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })} style={{ fontSize: 13, color: '#b8860b', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Mon Histoire
          </span>
        </div>
      </nav>
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '72px 24px 64px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontSize: 12, letterSpacing: '.08em', color: '#b8860b', marginBottom: 24, padding: '5px 16px', border: '0.5px solid #b8860b44', borderRadius: 99, fontWeight: 500 }}>
          Votre miroir dans l'Histoire
        </div>
        <h1 style={{ fontSize: isMobile ? 30 : 42, fontWeight: 700, color: '#1a1916', lineHeight: 1.1, letterSpacing: '-1px', marginBottom: 20 }}>
          CEUX QUI ONT FAIT L'HISTOIRE<br />
          <span style={{ color: '#b8860b' }}>AU JOUR LE JOUR</span>
        </h1>
        <p style={{ fontSize: isMobile ? 15 : 16, color: '#6b6a65', lineHeight: 1.75, maxWidth: 460, margin: '0 auto 48px' }}>
          Chaque jour, découvrez des événements qui ont fait l'Histoire, avec une perspective personnelle.
        </p>
        <div id="form-section">
          <form onSubmit={validateAndSubmit} style={{ background: '#f5f3ee', border: '0.5px solid #e8e6e0', borderRadius: 16, padding: '28px 24px 24px', textAlign: 'left', maxWidth: 400, margin: '0 auto' }}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: '#6b6a65', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '.06em' }}>Prénom</label>
              <input type="text" placeholder="Sophie" value={prenom} onChange={e => setPrenom(e.target.value)} style={{ width: '100%', padding: '11px 14px', fontSize: 15, background: '#ffffff', border: '0.5px solid #e8e6e0', borderRadius: 8, outline: 'none', color: '#1a1916', fontFamily: 'sans-serif', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontSize: 11, color: '#6b6a65', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '.06em' }}>Date de naissance</label>
              <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} min="1900-01-01" max={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: '11px 14px', fontSize: 15, background: '#ffffff', border: '0.5px solid #e8e6e0', borderRadius: 8, outline: 'none', color: '#1a1916', fontFamily: 'sans-serif', boxSizing: 'border-box' }} />
            </div>
            {error && (
              <div style={{ background: '#faf6ea', border: '0.5px solid #b8860b', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#b8860b', marginBottom: 14, lineHeight: 1.5 }}>
                {error}
              </div>
            )}
            <button type="submit" style={{ width: '100%', padding: '13px', background: '#1a1916', color: '#ffffff', border: 'none', borderRadius: 99, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif' }}>
              Découvrir mes héros du jour
            </button>
            <p style={{ fontSize: 12, color: '#a8a79f', textAlign: 'center', marginTop: 14 }}>Gratuit · sans compte</p>
          </form>
        </div>
      </section>
      <footer style={{ borderTop: '0.5px solid #e8e6e0', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#a8a79f', background: '#f5f3ee', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ color: '#1a1916', fontWeight: 600 }}>ChronoHeroes</span>
        <span onClick={() => router.push('/about')} style={{ cursor: 'pointer', color: '#6b6a65' }}>Comment ça marche</span>
        <span>© 2026 · <a href="mailto:hero@chronoheroes.com" style={{ color: '#b8860b', textDecoration: 'none' }}>hero@chronoheroes.com</a></span>
      </footer>
    </main>
  )
}
