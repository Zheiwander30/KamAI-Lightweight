import { useState, useEffect } from 'react'
import { Navbar }         from './components/Navbar'
import { Footer }         from './components/Footer'
import { Hero }           from './pages/Hero'
import { SignToText }     from './pages/SignToText'
import { LegalPage }      from './pages/LegalPage'
import { Features, HowItWorks, SupportBanner } from './pages/LandingSections'

// ─── Known routes ─────────────────────────────────────────────────────────────
// Only these paths are valid. Any other path renders NotFound (404).
// Mirrors the _redirects rules in public/_redirects exactly.
const KNOWN_ROUTES = new Set(['/', '/contact', '/privacy-policy', '/terms'])

// ─── 404 Page ─────────────────────────────────────────────────────────────────
function NotFound({ navigate }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="w-20 h-20 rounded-3xl bg-teal-50 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-teal-500 mb-2">404</p>
      <h1 style={{ fontFamily: 'var(--font-display)' }}
        className="font-black text-3xl sm:text-4xl text-gray-900 mb-3">
        Page not found
      </h1>
      <p className="text-gray-400 text-sm mb-8 max-w-xs">
        This page doesn't exist. It may have been moved, or you may have followed a bad link.
      </p>
      <button
        onClick={() => navigate('/')}
        className="btn-shimmer text-white font-semibold px-6 py-3 rounded-xl text-sm
          flex items-center gap-2 mx-auto">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
        </svg>
        Back to KamAI
      </button>
    </div>
  )
}

// ─── SPA Router ───────────────────────────────────────────────────────────────
function usePage() {
  const [page, setPage] = useState(window.location.pathname)

  useEffect(() => {
    const onPop = () => setPage(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = (path) => {
    // Reject navigation to unknown paths — keeps the router honest
    const target = KNOWN_ROUTES.has(path) ? path : '/'
    window.history.pushState({}, '', target)
    setPage(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return [page, navigate]
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, navigate] = usePage()

  const scrollToSigning = () => {
    if (page !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById('sign-to-text')?.scrollIntoView({ behavior: 'smooth' }), 80)
    } else {
      document.getElementById('sign-to-text')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (page === '/contact')        return <LegalPage page="contact" navigate={navigate} />
  if (page === '/privacy-policy') return <LegalPage page="privacy" navigate={navigate} />
  if (page === '/terms')          return <LegalPage page="terms"   navigate={navigate} />

  // Any path not in KNOWN_ROUTES renders 404
  // (Cloudflare already returns HTTP 404 status via _redirects;
  //  this handles the in-app case when navigating client-side)
  if (!KNOWN_ROUTES.has(page))    return <NotFound navigate={navigate} />

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onStartSigning={scrollToSigning} />
      <main className="flex-1">
        <Hero onStartSigning={scrollToSigning} />
        <SignToText />
        <Features />
        <HowItWorks onStartSigning={scrollToSigning} />
        <SupportBanner />
      </main>
      <Footer navigate={navigate} />
    </div>
  )
}
