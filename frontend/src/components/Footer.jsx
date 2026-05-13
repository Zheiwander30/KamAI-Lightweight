export function Footer({ navigate }) {
  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center">
            <img src="/assets/favicon.svg" alt="Logo" className="w-5 h-5 text-white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)' }} className="font-bold text-white">
            Kam<span className="text-teal-400">AI</span>
          </span>
          <span className="text-gray-600 text-sm ml-2">© 2026</span>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-sm text-gray-500">
          <button onClick={() => navigate('/contact')} className="hover:text-teal-400 transition-colors">Contact</button>
          <button onClick={() => navigate('/privacy-policy')} className="hover:text-teal-400 transition-colors">Privacy Policy</button>
          <button onClick={() => navigate('/terms')} className="hover:text-teal-400 transition-colors">Terms of Use</button>
          <span className="text-gray-700 text-xs">Powered by MediaPipe · Deployed on Cloudflare Pages</span>
        </div>
      </div>
    </footer>
  )
}
