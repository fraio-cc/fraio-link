import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserLinks } from '@/lib/links';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DashboardContent from './DashboardContent';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const links = await getUserLinks(session.user.id);

  return (
    <main className="min-h-screen bg-stone-950">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 p-6 bg-stone-900/50 border border-stone-800/50 rounded-xl">
            <div className="flex items-center gap-4">
              {session.user.image ? (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || 'User'} 
                  className="w-16 h-16 rounded-full border-2 border-amber-600"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-amber-600 flex items-center justify-center text-stone-950 font-bold text-xl">
                  {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-stone-100">
                  {session.user.name || 'Kullanıcı'}
                </h2>
                <p className="text-stone-400 text-sm">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-100 mb-2">
              Linkleriniz
            </h1>
            <p className="text-stone-400">
              Tüm kısaltılmış linklerinizi yönetin ve takip edin
            </p>
          </div>

          <DashboardContent initialLinks={links} baseUrl={process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
