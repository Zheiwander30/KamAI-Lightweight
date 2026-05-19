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

// ─── SEO: dynamic meta tags per page ─────────────────────────────────────────
const PAGE_META = {
  '/': {
    title:       'KamAI — Free Real-Time Sign Language to Text Interpreter',
    description: 'Convert Sign Language fingerspelling to text instantly using your webcam. No account, no install, no data uploaded. Runs 100% in your browser.',
    canonical:   'https://kamaisl.com/',
  },
  '/contact': {
    title:       'Contact — KamAI',
    description: 'Get in touch with the KamAI team. Report bugs, suggest features, or support the project on Ko-fi.',
    canonical:   'https://kamaisl.com/contact',
  },
  '/privacy-policy': {
    title:       'Privacy Policy — KamAI',
    description: 'KamAI collects no personal data. Your camera feed never leaves your device. Read our full privacy policy.',
    canonical:   'https://kamaisl.com/privacy-policy',
  },
  '/terms': {
    title:       'Terms of Use — KamAI',
    description: 'Terms of use for KamAI — the free real-time sign language to text interpreter.',
    canonical:   'https://kamaisl.com/terms',
  },
}

function useSEO(page) {
  useEffect(() => {
    const meta = PAGE_META[page] || PAGE_META['/']

    // Title
    document.title = meta.title

    // Description
    let desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', meta.description)

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', meta.canonical)

    // OG tags
    const ogTags = {
      'og:title':       meta.title,
      'og:description': meta.description,
      'og:url':         meta.canonical,
    }
    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`)
      if (tag) tag.setAttribute('content', content)
    })

    // Twitter tags
    const twitterTags = {
      'twitter:title':       meta.title,
      'twitter:description': meta.description,
      'twitter:url':         meta.canonical,
    }
    Object.entries(twitterTags).forEach(([name, content]) => {
      let tag = document.querySelector(`meta[name="${name}"]`)
      if (tag) tag.setAttribute('content', content)
    })
  }, [page])
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
  useSEO(page)

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
