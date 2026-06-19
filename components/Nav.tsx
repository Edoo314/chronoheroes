'use client'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

export default function Nav() {
  const router = useRouter()
  const locale = useLocale()
  const tn = useTranslations('nav')

  return (
    <nav style={{ borderBottom: '0.5px solid #e8e6e0', background: '#ffffff', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => router.push(`/${locale}`)}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="#b8860b" strokeWidth="1.5"/>
            <circle cx="14" cy="14" r="3" fill="#b8860b"/>
            <line x1="14" y1="2" x2="14" y2="8" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="14" y1="20" x2="14" y2="26" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="2" y1="14" x2="8" y2="14" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="20" y1="14" x2="26" y2="14" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#1a1916', letterSpacing: '-.3px' }}>{tn('brand')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            onClick={() => router.push('/fr')}
            style={{ fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: '4px 8px', borderRadius: 6,
              color: locale === 'fr' ? '#ffffff' : '#b8860b',
              background: locale === 'fr' ? '#b8860b' : 'transparent',
              border: '1px solid #b8860b' }}>
            FR
          </span>
          <span
            onClick={() => router.push('/en')}
            style={{ fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: '4px 8px', borderRadius: 6,
              color: locale === 'en' ? '#ffffff' : '#b8860b',
              background: locale === 'en' ? '#b8860b' : 'transparent',
              border: '1px solid #b8860b' }}>
            EN
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 20, padding: '8px 20px 10px', borderTop: '0.5px solid #f0ede8' }}>
        <span onClick={() => router.push(`/${locale}/about`)} style={{ fontSize: 12, color: '#6b6a65', cursor: 'pointer' }}>{tn('howItWorks')}</span>
        <span onClick={() => router.push(`/${locale}/stats`)} style={{ fontSize: 12, color: '#6b6a65', cursor: 'pointer' }}>{tn('statistics')}</span>
      </div>
    </nav>
  )
}
