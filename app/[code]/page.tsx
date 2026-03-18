import { notFound } from 'next/navigation';
import { getLinkByCode } from '@/lib/links';
import RedirectClient from './RedirectClient';

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function RedirectPage({ params }: PageProps) {
  const { code } = await params;

  const link = await getLinkByCode(code);

  if (!link) {
    notFound();
  }

  const isAnonymous = !link.user_id;

  return <RedirectClient url={link.original_url} linkId={link.id} isAnonymous={isAnonymous} />;
}
