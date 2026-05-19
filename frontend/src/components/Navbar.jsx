import { useState, useEffect } from 'react'

export function Navbar({ onStartSigning }) {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <header role="banner"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300
      ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">

        <a href="#" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center">
            <img src="/assets/favicon.png" alt="Logo" className="w-5 h-5 text-white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)' }} className="font-bold text-xl text-gray-900">
            Kam<span className="text-teal-500">AI</span>
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {[['features','Features'],['how-it-works','How It Works']].map(([id, label]) => (
            <li key={id}>
              <button onClick={() => scrollTo(id)}
                className="nav-underline text-sm font-medium text-gray-700 hover:text-teal-500 transition-colors">
                {label}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={onStartSigning}
            className="btn-shimmer text-white text-sm font-semibold px-5 py-2 rounded-lg">
            Start Signing
          </button>
        </div>

        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
          <span className={`block w-5 h-0.5 bg-gray-800 transition-all duration-200 mb-1.5 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-800 transition-all duration-200 mb-1.5 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-800 transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-white z-40 px-4 py-6 flex flex-col gap-1 animate-fadeIn overflow-y-auto">
          {[['features','Features'],['how-it-works','How It Works']].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)}
              className="block py-3 px-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-colors text-left">
              {label}
            </button>
          ))}
          <div className="h-px bg-gray-100 my-2" />
          <a href="https://ko-fi.com" target="_blank" rel="noopener noreferrer"
            className="block py-3 px-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-teal-50 hover:text-teal-600">
            ☕ Support on Ko-fi
          </a>
          <button onClick={() => { onStartSigning(); setMobileOpen(false) }}
            className="mt-4 w-full text-center py-3 text-sm font-semibold text-white btn-shimmer rounded-xl">
            Start Signing
          </button>
        </div>
      )}
    </header>
  )
}
