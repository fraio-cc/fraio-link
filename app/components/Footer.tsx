export default function Footer() {
  const version = "v0.1.0";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-950 py-12 px-6 border-t border-stone-800/50">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-stone-950 font-bold shadow-lg shadow-amber-500/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <span className="text-lg font-bold text-stone-100">Fraio Link</span>
            </div>
            <p className="text-stone-500 text-sm">
              Hızlı, güvenli ve ücretsiz URL kısaltma servisi
            </p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-stone-900 border border-stone-800 rounded text-stone-400 text-xs font-mono">
                {version}
              </span>
              <a 
                href="https://github.com/fraio-cc/fraio-link" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-2 py-1 bg-stone-900 border border-stone-800 rounded text-stone-400 hover:text-amber-500 hover:border-amber-500/50 transition-colors text-xs flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Open Source
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-stone-300 font-semibold text-sm">Hızlı Linkler</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-stone-400 hover:text-amber-500 transition-colors">
                  Ana Sayfa
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-stone-400 hover:text-amber-500 transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="https://fraio.cc/privacy" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-amber-500 transition-colors">
                  Gizlilik Politikası
                </a>
              </li>
              <li>
                <a href="https://fraio.cc/terms" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-amber-500 transition-colors">
                  Kullanım Şartları
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-stone-300 font-semibold text-sm">Fraio Ekosistemi</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://fraio.cc" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-amber-500 transition-colors">
                  Fraio Studio
                </a>
              </li>
              <li>
                <a href="https://fraio.cc/about" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-amber-500 transition-colors">
                  Hakkımızda
                </a>
              </li>
              <li>
                <a href="https://fraio.cc/contact" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-amber-500 transition-colors">
                  İletişim
                </a>
              </li>
              <li>
                <a href="https://github.com/fraio-cc" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-amber-500 transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            <p>
              &copy; {currentYear} Fraio Link. Tüm hakları saklıdır. MIT Lisansı ile açık kaynak.
            </p>
            <p>
              <a href="https://fraio.cc" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 transition-colors">
                Fraio Studio
              </a> tarafından ❤️ ile yapıldı
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
