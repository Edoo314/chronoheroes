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
    <main style={{ minHeight: '100vh', background: '#f5f3ee', fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '0.5px solid #e8e6e0', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#b8860b' }} />
          <span style={{ fontSize: 16, fontWeight: 500, color: '#1a1916' }}>ChronoHeroes</span>
        </div>
        <span style={{ fontSize: 13, color: '#a8a79f' }}>L Histoire a votre age exact</span>
      </nav>
      <section style={{ maxWidth: 600, margin: '0 auto', padding: '72px 24px 60px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: '#a8a79f', marginBottom: 20 }}>ChronoHeroes</p>
        <h1 style={{ fontSize: 40, fontWeight: 500, color: '#1a1916', lineHeight: 1.15, letterSpacing: '-.5px', marginBottom: 18 }}>
          L Histoire a votre age <span style={{ color: '#a8a79f' }}>exact.</span>
        </h1>
        <p style={{ fontSize: 16, color: '#6b6a65', lineHeight: 1.75, marginBottom: 40, maxWidth: 440, margin: '0 auto 40px' }}>
          Chaque jour, decouvrez ce que des heros ont accompli au meme nombre de jours de vie que vous.
        </p>
        <form onSubmit={handleSubmit} style={{ background: '#fff', border: '0.5px solid #e8e6e0', borderRadius: 16, padding: 28, textAlign: 'left', maxWidth: 380, margin: '0 auto' }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: '#6b6a65', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>Prenom</label>
            <input type="text" placeholder="Sophie" value={prenom} onChange={e => setPrenom(e.target.value)} style={{ width: '100%', padding: '10px 14px', fontSize: 14, border: '0.5px solid #e8e6e0', borderRadius: 8, outline: 'none', fontFamily: 'sans-serif', color: '#1a1916', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, color: '#6b6a65', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>Date de naissance</label>
            <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} style={{ width: '100%', padding: '10px 14px', fontSize: 14, border: '0.5px solid #e8e6e0', borderRadius: 8, outline: 'none', fontFamily: 'sans-serif', color: '#1a1916', boxSizing: 'border-box' }} />
          </div>
          {error && <p style={{ fontSize: 12, color: '#A32D2D', marginBottom: 10 }}>{error}</p>}
          <button type="submit" style={{ width: '100%', padding: 12, background: '#1a1916', color: '#fff', border: 'none', borderRadius: 99, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'sans-serif' }}>
            Voir mes heros du jour
          </button>
          <p style={{ fontSize: 11, color: '#a8a79f', textAlign: 'center', marginTop: 12 }}>Gratuit - sans compte - 20 secondes</p>
        </form>
      </section>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '0.5px solid #e8e6e0', borderBottom: '0.5px solid #e8e6e0', background: '#fff' }}>
        {[{n:'538+',l:'evenements dates'},{n:'176',l:'personnages'},{n:'0 jour',l:'precision'}].map((s,i) => (
          <div key={i} style={{ padding: '24px 20px', textAlign: 'center', borderRight: i < 2 ? '0.5px solid #e8e6e0' : 'none' }}>
            <div style={{ fontSize: 24, fontWeight: 500, color: '#1a1916', marginBottom: 4 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: '#a8a79f' }}>{s.l}</div>
          </div>
        ))}
      </section>
      <footer style={{ borderTop: '0.5px solid #e8e6e0', padding: '24px', display: 'flex', justifyContent: 'space-between', background: '#fff', fontSize: 12, color: '#a8a79f' }}>
        <span style={{ fontWeight: 500, color: '#1a1916' }}>ChronoHeroes</span>
        <span>L Histoire a votre age exact</span>
      </footer>
    </main>
  )
}
