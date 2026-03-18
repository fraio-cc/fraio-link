'use client';

import { useEffect, useState } from 'react';

interface RedirectClientProps {
  url: string;
  linkId: string;
  isAnonymous: boolean;
}

export default function RedirectClient({ url, linkId, isAnonymous }: RedirectClientProps) {
  const [countdown, setCountdown] = useState(isAnonymous ? 1 : 0);

  useEffect(() => {
    fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkId }),
    }).catch(err => console.error('Track error:', err));

    if (!isAnonymous) {
      window.location.href = url;
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = url;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [url, linkId, isAnonymous]);

  if (!isAnonymous) {
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-stone-950 font-bold shadow-lg shadow-amber-500/20">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-stone-100">Fraio Link</span>
        </div>

        <div className="relative">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-stone-900 border-4 border-amber-600 flex items-center justify-center">
            <span className="text-4xl font-bold text-amber-500">{countdown}</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-24 h-24 rounded-full border-4 border-transparent border-t-amber-600 animate-spin"></div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-stone-300 text-lg font-medium">
            Yönlendiriliyorsunuz...
          </p>
          <p className="text-stone-500 text-sm">
            Lütfen bekleyin
          </p>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-br from-stone-900 to-stone-900/50 border border-stone-800 rounded-2xl">
          <div className="flex items-center justify-center gap-2 mb-3">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-amber-500 font-semibold">Ücretsiz Link Kısaltma</span>
          </div>
          <p className="text-stone-400 text-sm mb-4">
            Kendi linklerinizi oluşturun, reklamsız yönlendirme ve detaylı analitik için
          </p>
          <a
            href="https://fraio.cc/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl transition-colors"
          >
            fraio.cc'de Hesap Oluştur
          </a>
        </div>

        <button
          onClick={() => window.location.href = url}
          className="text-stone-500 hover:text-stone-300 text-sm transition-colors"
        >
          Hemen git →
        </button>
      </div>
    </div>
  );
}
