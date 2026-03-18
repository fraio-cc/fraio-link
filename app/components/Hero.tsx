'use client';

import { useState, useRef } from 'react';
import { QRCode } from 'react-qrcode-logo';

export default function Hero() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef<any>(null);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setLoading(true);

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Link kısaltılamadı');
      }

      setShortUrl(data.shortUrl);
      setUrl('');
      setShowQR(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    if (qrRef.current) {
      qrRef.current.download('png', 'fraio-qr-code');
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-16 px-6 bg-stone-950">
      <div className="w-full max-w-3xl space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/50 border border-stone-800/50 text-stone-400 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Ücretsiz & Açık Kaynak
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-stone-100 tracking-tight">
            Linklerini Kısalt
          </h1>
          
          <p className="text-lg md:text-xl text-stone-400 max-w-xl mx-auto">
            Hızlı, basit ve güçlü URL kısaltıcı ile analitik takibi
          </p>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleShorten} className="relative">
            <div className="relative group">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Uzun URL'nizi buraya yapıştırın..."
                className="w-full px-6 py-5 pr-32 bg-stone-900 border-2 border-stone-800 rounded-2xl text-stone-100 text-lg placeholder:text-stone-600 focus:outline-none focus:border-amber-500 transition-all"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-800 disabled:text-stone-600 text-stone-950 font-bold rounded-xl transition-all active:scale-95"
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  'Kısalt'
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {shortUrl && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 bg-gradient-to-br from-stone-900 to-stone-900/50 border border-stone-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400 text-sm font-medium">Kısaltılmış linkiniz:</span>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-500 text-sm font-medium">Hazır</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1 px-4 py-3 bg-stone-950 border border-stone-800 rounded-xl">
                    <a 
                      href={shortUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-500 font-mono text-sm hover:text-amber-400 transition-colors break-all"
                    >
                      {shortUrl}
                    </a>
                  </div>
                  
                  <button
                    onClick={copyToClipboard}
                    className="px-5 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl transition-all flex items-center gap-2 group"
                  >
                    {copied ? (
                      <>
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-green-500 font-medium">Kopyalandı</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Kopyala</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {showQR && (
                <div className="p-6 bg-gradient-to-br from-stone-900 to-stone-900/50 border border-stone-800 rounded-2xl">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* QR Kod */}
                    <div className="flex-shrink-0">
                      <div className="relative p-6 bg-white rounded-3xl shadow-2xl shadow-amber-500/20">
                        <QRCode
                          ref={qrRef}
                          value={shortUrl}
                          size={300}
                          quietZone={10}
                          ecLevel="H"
                          enableCORS={false}
                          qrStyle="fluid"
                          eyeRadius={[
                            [20, 20, 0, 20],
                            [20, 20, 20, 0],
                            [20, 0, 20, 20],
                          ]}
                          eyeColor="#d97706"
                          fgColor="#1c1917"
                          bgColor="#ffffff"
                          logoImage="/fraio-black.png"
                          logoWidth={100}
                          logoHeight={100}
                          logoOpacity={1}
                          logoPadding={15}
                          logoPaddingStyle="circle"
                          removeQrCodeBehindLogo={true}
                        />
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-stone-100 mb-2">
                          QR Kod ile Paylaş
                        </h3>
                        <p className="text-stone-400 text-sm">
                          Offline paylaşım için QR kodunu kullanabilirsiniz. Mobil cihazlarla tarayarak direkt linke erişim sağlayın.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={downloadQR}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium rounded-xl transition-all flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          QR Kodu İndir
                        </button>
                        
                        <button
                          onClick={() => setShowQR(false)}
                          className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium rounded-xl transition-all flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                          Gizle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-8">
          <div className="text-center p-4 rounded-xl bg-stone-900/30 border border-stone-800/30">
            <div className="text-2xl font-bold text-amber-500">Ücretsiz</div>
            <div className="text-sm text-stone-500 mt-1">Sonsuza Kadar</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-stone-900/30 border border-stone-800/30">
            <div className="text-2xl font-bold text-amber-500">Hızlı</div>
            <div className="text-sm text-stone-500 mt-1">Anında</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-stone-900/30 border border-stone-800/30">
            <div className="text-2xl font-bold text-amber-500">Güvenli</div>
            <div className="text-sm text-stone-500 mt-1">SSL Korumalı</div>
          </div>
        </div>
      </div>
    </section>
  );
}
