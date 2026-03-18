'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-950/80 backdrop-blur-md border-b border-stone-800/50">
      <div className="container mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-stone-950 font-bold shadow-lg shadow-amber-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <span className="text-lg font-bold text-stone-100 group-hover:text-amber-500 transition-colors">
              Fraio Link
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            {status === 'loading' ? (
              <div className="w-20 h-9 bg-stone-900 animate-pulse rounded-lg"></div>
            ) : session ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-stone-300 hover:text-stone-100 transition-colors"
                >
                  Panel
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 text-sm font-medium text-stone-400 hover:text-red-400 transition-colors"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-stone-300 hover:text-stone-100 transition-colors"
                >
                  Giriş
                </Link>
                <a
                  href="https://fraio.cc/register"
                  className="px-4 py-2 text-sm font-bold bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-lg transition-colors"
                >
                  Kayıt Ol
                </a>
              </>
            )}
            <a
              href="https://fraio.cc"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-stone-500 hover:text-amber-500 transition-colors"
            >
              by Fraio
            </a>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-400 hover:text-stone-100 transition-colors relative w-10 h-10 flex items-center justify-center"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-full bg-current transform transition-all duration-300 ${
                  mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              ></span>
              <span
                className={`block h-0.5 w-full bg-current transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              ></span>
              <span
                className={`block h-0.5 w-full bg-current transform transition-all duration-300 ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              ></span>
            </div>
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="mt-4 pt-4 border-t border-stone-800/50 space-y-2">
            {status === 'loading' ? (
              <div className="w-full h-10 bg-stone-900 animate-pulse rounded-lg"></div>
            ) : session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-stone-300 hover:text-stone-100 hover:bg-stone-900 rounded-lg transition-colors"
                >
                  Panel
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-stone-400 hover:text-red-400 hover:bg-stone-900 rounded-lg transition-colors"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-stone-300 hover:text-stone-100 hover:bg-stone-900 rounded-lg transition-colors"
                >
                  Giriş
                </Link>
                <a
                  href="https://fraio.cc/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-bold bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-lg transition-colors text-center"
                >
                  Kayıt Ol
                </a>
              </>
            )}
            <a
              href="https://fraio.cc"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-stone-500 hover:text-amber-500 hover:bg-stone-900 rounded-lg transition-colors"
            >
              by Fraio
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
