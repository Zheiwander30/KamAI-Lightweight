import { useState, useEffect } from 'react'

// ─── Hero ─────────────────────────────────────────────────────────────────────
export function Hero({ onStartSigning }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 150); return () => clearTimeout(t) }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-14 sm:pt-16" aria-label="Hero — KamAI sign language interpreter">
      <div className="absolute -top-32 -left-32 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-teal-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-teal-50 rounded-full blur-2xl opacity-60 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[250px] h-[250px] bg-teal-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-12 md:py-0">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">

          <div className="space-y-6 sm:space-y-8 text-center md:text-left order-2 md:order-1">
            <div className={`inline-flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full
              px-3 sm:px-4 py-1.5 text-xs font-semibold text-teal-700
              ${visible ? 'animate-fadeUp' : 'opacity-0'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulseRing" />
              No account required — 100% free
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)' }}
              className={`font-black text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl
                leading-[1.05] tracking-tight text-gray-900
                ${visible ? 'animate-fadeUp' : 'opacity-0'} delay-100`}>
              When Hands{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-teal-500">Speak,</span>
                <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
                  <path d="M0 3 Q25 0 50 3 Q75 6 100 3 Q125 0 150 3 Q175 6 200 3"
                    stroke="#2AABAC" strokeWidth="2.5" fill="none" opacity="0.5"/>
                </svg>
              </span>
              <br />
              Everyone{' '}
              <span className="italic font-bold text-gray-700">Listens</span>
            </h1>

            <p className={`text-gray-500 text-base sm:text-lg leading-relaxed max-w-sm mx-auto md:mx-0
              ${visible ? 'animate-fadeUp' : 'opacity-0'} delay-200`}>
              Real-time Sign Language gesture recognition, right in your browser.
              No login. No uploads. <br /> <span className="text-gray-700 font-semibold">All on Browser.</span>
            </p>

            <div className={`flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4
              ${visible ? 'animate-fadeUp' : 'opacity-0'} delay-300`}>
              <button onClick={onStartSigning}
                className="btn-shimmer w-full sm:w-auto text-white font-semibold text-base
                  px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl flex items-center justify-center gap-3 group">
                Start Signing
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </div>

            <div className={`flex flex-wrap justify-center md:justify-start gap-6 sm:gap-8 pt-2
              ${visible ? 'animate-fadeUp' : 'opacity-0'} delay-400`}>
              <div className="stat-pill pl-3">
                <p className="text-teal-500 text-xl sm:text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>26</p>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Letters</p>
              </div>
              <div className="stat-pill pl-3">
                <p className="text-teal-500 text-xl sm:text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>3+</p>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Languages</p>
              </div>
              <div className="stat-pill pl-3">
                <p className="text-teal-500 text-xl sm:text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Free</p>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Forever</p>
              </div>
            </div>
          </div>

          <div className={`relative order-1 md:order-2 ${visible ? 'animate-fadeUp' : 'opacity-0'} delay-200`}>
            <div className="hidden sm:block absolute -top-6 -right-6 w-56 md:w-72 h-56 md:h-72
              rounded-full border-2 border-dashed border-teal-200 animate-float opacity-60 pointer-events-none" />
            <div className="hidden sm:block absolute -bottom-4 -left-4 w-32 md:w-40 h-32 md:h-40
              rounded-full border border-teal-300 opacity-30 pointer-events-none" />

            <div className="hero-clip overflow-hidden shadow-2xl bg-gray-900 rounded-2xl aspect-video relative flex flex-col">
              <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 relative flex items-center justify-center">
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)'
                }} />
                <svg className="w-32 h-32 text-teal-400/30 animate-wave" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50 85 C35 85 25 75 25 60 L25 35 C25 32 27 30 30 30 C33 30 35 32 35 35 L35 50
                    L35 30 C35 27 37 25 40 25 C43 25 45 27 45 30 L45 50
                    L45 28 C45 25 47 23 50 23 C53 23 55 25 55 28 L55 50
                    L55 32 C55 29 57 27 60 27 C63 27 65 29 65 32 L65 52
                    C65 52 70 45 72 43 C74 41 77 42 78 44 C79 46 78 48 76 50
                    L65 65 C62 75 57 85 50 85Z"/>
                </svg>
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-teal-400/60 rounded-tl" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-teal-400/60 rounded-tr" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-teal-400/60 rounded-bl" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-teal-400/60 rounded-br" />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-2xl px-4 py-3 text-center">
                  <p className="text-5xl font-black text-white leading-none tracking-tighter">H</p>
                  <p className="text-xs font-bold mt-1 text-green-400">94%</p>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs text-white/60 font-mono">LIVE</span>
                </div>
              </div>
              <div className="bg-gray-800/80 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  {['H','E','L','L','O'].map((ch, i) => (
                    <span key={i} className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/40
                      flex items-center justify-center text-teal-300 font-bold text-sm">{ch}</span>
                  ))}
                  <span className="w-7 h-7 rounded-lg border-2 border-dashed border-teal-500/30
                    flex items-center justify-center text-teal-500/40 animate-pulse">_</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:block absolute bottom-6 md:bottom-8 -left-4 md:-left-8
              glass-card rounded-2xl px-4 py-3 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white text-base">🤟</div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">On-device AI</p>
                  <p className="text-xs text-teal-600 font-medium">● No data uploaded</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-1 opacity-40">
        <span className="text-xs text-gray-400 font-medium">Scroll</span>
        <svg className="w-4 h-4 text-gray-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
