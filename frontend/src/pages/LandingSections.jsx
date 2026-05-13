// ─── Features ─────────────────────────────────────────────────────────────────
export const FEATURES = [
  { icon: '🧠', title: 'On-Device AI', desc: 'The AI processes your hand landmarks locally — zero server round-trips, zero latency spikes.', color: 'bg-teal-50 text-teal-600' },
  { icon: '🌏', title: 'Multi-Language Support', desc: 'Switch between supported sign languages from the model selector.', color: 'bg-blue-50 text-blue-600' },
  { icon: '🔒', title: 'Privacy First', desc: 'No video is ever stored or uploaded. Processing stays entirely on your device.', color: 'bg-rose-50 text-rose-600' },
  { icon: '💻', title: 'Works Everywhere', desc: 'Browser-based, no install needed. Any desktop or laptop with a webcam will do.', color: 'bg-amber-50 text-amber-600' },
  { icon: '⚡', title: 'Real-Time Detection', desc: 'Hand skeleton landmarks are tracked every frame, giving you instant visual feedback.', color: 'bg-purple-50 text-purple-600' },
  { icon: '♿', title: 'Accessible by Design', desc: 'Keyboard shortcuts for Space and Backspace — no mouse needed during signing.', color: 'bg-green-50 text-green-600' },
]

export function Features() {
  return (
    <section id="features" className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16"> 
          <span className="text-xs font-bold uppercase tracking-widest text-teal-500">Features</span>
          <h2 style={{ fontFamily: 'var(--font-display)' }}
            className="font-black text-3xl sm:text-4xl md:text-5xl text-gray-900 mt-3 mb-4">
            Everything you need for<br/>
            <span className="text-teal-500 italic">inclusive communication</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            KamAI removes barriers between hearing and Deaf communities — in real time, in any browser.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {FEATURES.map(f => (
            <div key={f.title}
              className="group bg-white rounded-2xl p-6 sm:p-7 border border-gray-100
                hover:border-teal-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center
                text-xl sm:text-2xl ${f.color} mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-200`}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)' }}
                className="font-bold text-base sm:text-lg text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────
export function HowItWorks({ onStartSigning }) {
  const steps = [
    { n: '01', title: 'Allow Camera', desc: 'Grant webcam permission when prompted. Make sure your webcam is on.' },
    { n: '02', title: 'Choose Model', desc: 'Pick any language model from the model selector above the Start button.' },
    { n: '03', title: 'Sign a Letter', desc: 'Hold a hand sign steady. The detected letter and confidence appear instantly.' },
    { n: '04', title: 'Build Words', desc: 'Letters stack into words. Press Space (or the button) to add a word to your transcript.' },
  ]

  return (
    <section id="how-it-works" className="py-16 sm:py-20 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-500">How It Works</span>
          <h2 style={{ fontFamily: 'var(--font-display)' }}
            className="font-black text-3xl sm:text-4xl text-gray-900 mt-3 mb-4">
            From hand to text in seconds
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-teal-100 z-0" style={{ width: 'calc(100% - 2rem)' }} />
              )}
              <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-teal-500 flex items-center justify-center mb-4">
                  <span style={{ fontFamily: 'var(--font-display)' }} className="font-black text-white text-lg">{s.n}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)' }} className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button onClick={onStartSigning}
            className="btn-shimmer text-white font-semibold px-8 py-4 rounded-2xl inline-flex items-center gap-3 group">
            Try it now — it's free
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── Ko-fi Banner ─────────────────────────────────────────────────────────────
export function SupportBanner() {
  return (
    <section className="py-16 bg-teal-500">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="mb-6 flex justify-center">
          <img 
            src="/assets/favicon.svg" 
            alt="Support Icon" 
            className="w-16 h-16 sm:w-20 sm:h-20" 
          />
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)' }}
          className="font-black text-3xl sm:text-4xl text-white mb-4">
          KamAI is free, forever.
        </h2>
        <p className="text-teal-100 text-base sm:text-lg mb-8 max-w-xl mx-auto">
          If KamAI helped you communicate or practice sign language, consider buying us a coffee. Your support keeps this tool free and actively maintained.
        </p>
        <a href="https://ko-fi.com/E1E21X5T2F" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-teal-600 font-bold px-8 py-4 rounded-2xl
            hover:bg-teal-50 transition-colors shadow-lg">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/>
          </svg>
          Support on Ko-fi
        </a>
        <p className="text-teal-200 text-xs mt-4">No pressure — the tool is always free either way.</p>
      </div>
    </section>
  )
}
