import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 px-6">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-stone-900 border border-stone-800">
            <span className="text-4xl">🔗</span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-6xl font-display font-bold text-amber-500">
              404
            </h1>
            <h2 className="text-2xl font-display font-semibold text-stone-100">
              Link Not Found
            </h2>
            <p className="text-stone-400">
              This short link doesn't exist or has expired.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold rounded-xl transition-all duration-200"
          >
            Create New Link
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 font-medium rounded-xl transition-all duration-200"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
