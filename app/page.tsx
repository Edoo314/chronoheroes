'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { computeUserDays } from '@/lib/supabase'
export default function HomePage() {
  const router = useRouter()
  const [prenom, setPrenom] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [error, setError] = useState('')
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prenom.trim()) { setError('Merci d entrer votre prenom.'); return }
    if (!birthdate) { setError('Merci d entrer votre date de naissance.'); return }
    setError('')
    const { userDays } = computeUserDays(birthdate)
    localStorage.setItem('ch_prenom', prenom.trim())
    localStorage.setItem('ch_birthdate', birthdate)
    localStorage.setItem('ch_userdays', String(userDays))
    router.push('/timeline')
  }
  return (
    <main style={{ minHeight: '100vh', background: '#0f0e0c', fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderBottom: '0.5px solid #2a2926' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="#b8860b" strokeWidth="1.5"/>
            <circle cx="14" cy="14" r="3" fill="#b8860b"/>
            <line x1="14" y1="2" x2="14" y2="8" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="14" y1="20" x2="14" y2="26" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="2" y1="14" x2="8" y2="14" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="20" y1="14" x2="26" y2="14" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 17, fontWeight: 600, color: '#f0ede6', letterSpacing: '-.2px' }}>ChronoHeroes</span>
        </div>
        <span style={{ fontSize: 13, color: '#6b6a65' }}>L Histoire au jour le jour</span>
      </nav>
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '80px 32px 72px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: '#b8860b', marginBottom: 24, padding: '4px 14px', border: '0.5px solid #b8860b33', borderRadius: 99 }}>
          Votre miroir dans l Histoire
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 700, color: '#f0ede6', lineHeight: 1.08, letterSpacing: '-1.5px', marginBottom: 24, textTransform: 'uppercase' }}>
          Ceux qui ont fait<br />
          <span style={{ color: '#b8860b' }}>l Histoire</span> au jour le jour
        </h1>
        <p style={{ fontSize: 17, color: '#9e9b93', lineHeight: 1.75, marginBottom: 48, maxWidth: 480, margin: '0 auto 48px' }}>
          Chaque jour, decouvrez des evenements qui ont fait l histoire dans votre perspective personnelle.
        </p>
        <form onSubmit={handleSubmit} style={{ background: '#1a1916', border: '0.5px solid #2e2d29', borderRadius: 16, padding: '28px 28px 24px', textAlign: 'left', maxWidth: 400, margin: '0 auto' }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: '#6b6a65', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '.06em' }}>Prenom</label>
            <input type="text" placeholder="Sophie" value={prenom} onChange={e => setPrenom(e.target.value)} style={{ width: '100%', padding: '11px 14px', fontSize: 15, background: '#0f0e0c', border: '0.5px solid #2e2d29', borderRadius: 8, outline: 'none', color: '#f0ede6', fontFamily: 'sans-serif', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 11, color: '#6b6a65', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '.06em' }}>Date de naissance</label>
            <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} style={{ width: '100%', padding: '11px 14px', fontSize: 15, background: '#0f0e0c', border: '0.5px solid #2e2d29', borderRadius: 8, outline: 'none', color: '#f0ede6', fontFamily: 'sans-serif', boxSizing: 'border-box', colorScheme: 'dark' }} />
          </div>
          {error && <p style={{ fontSize: 12, color: '#E24B4A', marginBottom: 12 }}>{error}</p>}
          <button type="submit" style={{ width: '100%', padding: '13px', background: '#b8860b', color: '#0f0e0c', border: 'none', borderRadius: 99, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif' }}>
            Decouvrir mes heros du jour
          </button>
          <p style={{ fontSize: 12, color: '#444441', textAlign: 'center', marginTop: 14 }}>Gratuit - sans compte - 20 secondes</p>
        </form>
      </section>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', borderTop: '0.5px solid #2a2926', borderBottom: '0.5px solid #2a2926' }}>
        {[{n:'537+',l:'evenements dates au jour'},{n:'176',l:'personnages historiques'}].map((s,i) => (
          <div key={i} style={{ padding: '28px 20px', textAlign: 'center', borderRight: i < 1 ? '0.5px solid #2a2926' : 'none' }}>
            <div style={{ fontSize: 26, fontWeight: 600, color: '#f0ede6', marginBottom: 5 }}>{s.n}</div>
            <div style={{ fontSize: 12, color: '#6b6a65' }}>{s.l}</div>
          </div>
        ))}
      </section>
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '64px 32px' }}>
        {[
          {n:'01', t:'Votre vie en jours', p:'ChronoHeroes calcule votre nombre exact de jours de vie. C est cette unite qui permet la comparaison precise avec chaque heros de notre base.'},
          {n:'02', t:'Le matching au jour pres', p:'Chaque personnage possede sa date de naissance exacte. On calcule son age en jours au moment de son exploit, et on le compare au votre. L ecart s affiche sur chaque carte.'},
          {n:'03', t:'L Histoire en perspective', p:'L objectif n est pas de vous comparer a ces heros. C est de sentir que l Histoire est faite de vies humaines qui ont toutes traverse l age que vous avez aujourd hui.'},
        ].map((s,i) => (
          <div key={i} style={{ display: 'flex', gap: 20, paddingBottom: 28, borderBottom: i < 2 ? '0.5px solid #2a2926' : 'none', marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: '#444441', width: 24, paddingTop: 4, flexShrink: 0 }}>{s.n}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 500, color: '#f0ede6', marginBottom: 8 }}>{s.t}</div>
              <div style={{ fontSize: 14, color: '#6b6a65', lineHeight: 1.75 }}>{s.p}</div>
            </div>
          </div>
        ))}
      </section>
      <footer style={{ borderTop: '0.5px solid #2a2926', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#444441' }}>
        <span style={{ color: '#6b6a65', fontWeight: 500 }}>ChronoHeroes</span>
        <span>L Histoire au jour le jour</span>
      </footer>
    </main>
  )
}
