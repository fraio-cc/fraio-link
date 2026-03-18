'use client';

import { useState, useRef } from 'react';
import type { Link } from '@/lib/links';
import { QRCode } from 'react-qrcode-logo';

interface DashboardContentProps {
  initialLinks: Link[];
  baseUrl: string;
}

export default function DashboardContent({ initialLinks, baseUrl }: DashboardContentProps) {
  const [links, setLinks] = useState(initialLinks);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [qrLink, setQrLink] = useState<Link | null>(null);
  const [deletingLink, setDeletingLink] = useState<Link | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const qrRef = useRef<any>(null);

  const copyToClipboard = (shortCode: string, id: string) => {
    navigator.clipboard.writeText(`${baseUrl}/${shortCode}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openEditModal = (link: Link) => {
    setEditingLink(link);
    setEditUrl(link.original_url);
    setError('');
  };

  const closeEditModal = () => {
    setEditingLink(null);
    setEditUrl('');
    setError('');
  };

  const openQrModal = (link: Link) => {
    setQrLink(link);
  };

  const closeQrModal = () => {
    setQrLink(null);
  };

  const openDeleteModal = (link: Link) => {
    setDeletingLink(link);
  };

  const closeDeleteModal = () => {
    setDeletingLink(null);
  };

  const handleDelete = async () => {
    if (!deletingLink) return;

    setIsDeleting(true);

    try {
      const response = await fetch('/api/delete-link', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkId: deletingLink.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Link silinemedi');
      }

      setLinks(links.filter(link => link.id !== deletingLink.id));
      closeDeleteModal();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const downloadQR = () => {
    if (qrRef.current && qrLink) {
      qrRef.current.download('png', `fraio-qr-${qrLink.short_code}`);
    }
  };

  const handleUpdate = async () => {
    if (!editingLink) return;

    setIsUpdating(true);
    setError('');

    try {
      const response = await fetch('/api/update-link', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkId: editingLink.id,
          originalUrl: editUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Link güncellenemedi');
      }

      setLinks(links.map(link => 
        link.id === editingLink.id ? data.link : link
      ));
      closeEditModal();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (links.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center">
          <svg className="w-10 h-10 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-stone-300 mb-2">Henüz link yok</h3>
        <p className="text-stone-500 mb-6">İlk kısaltılmış linkinizi oluşturun</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl transition-colors"
        >
          Link Oluştur
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {links.map((link) => (
          <div
            key={link.id}
            className="p-6 bg-stone-900/50 border border-stone-800/50 rounded-xl hover:bg-stone-900 hover:border-stone-700 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <a
                    href={`/${link.short_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-500 font-mono text-lg hover:text-amber-400 transition-colors"
                  >
                    {baseUrl.replace('http://', '').replace('https://', '')}/{link.short_code}
                  </a>
                  <button
                    onClick={() => copyToClipboard(link.short_code, link.id)}
                    className="p-1.5 hover:bg-stone-800 rounded-lg transition-colors"
                    title="Linki kopyala"
                  >
                    {copiedId === link.id ? (
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
                
                <p className="text-stone-400 text-sm truncate mb-3">
                  {link.original_url}
                </p>

                <div className="flex items-center gap-4 text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {link.clicks} tıklama
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(link.created_at)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openQrModal(link)}
                  className="p-2 hover:bg-stone-800 text-stone-400 hover:text-amber-500 rounded-lg transition-colors"
                  title="QR Kod"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </button>
                <button
                  onClick={() => openEditModal(link)}
                  className="p-2 hover:bg-stone-800 text-stone-400 hover:text-blue-500 rounded-lg transition-colors"
                  title="Linki düzenle"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => openDeleteModal(link)}
                  className="p-2 hover:bg-stone-800 text-stone-400 hover:text-red-500 rounded-lg transition-colors"
                  title="Linki sil"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <a
                  href={link.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-stone-800 text-stone-400 hover:text-stone-200 rounded-lg transition-colors"
                  title="Orjinal URL'yi ziyaret et"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingLink && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={closeEditModal}>
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-stone-100">Linki Düzenle</h3>
              <button
                onClick={closeEditModal}
                className="p-2 hover:bg-stone-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-300 mb-2">
                Kısa Kod
              </label>
              <div className="px-4 py-3 bg-stone-800/50 border border-stone-700 rounded-xl text-stone-400 font-mono">
                {editingLink.short_code}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-300 mb-2">
                Yönlendirilecek URL
              </label>
              <input
                type="url"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-600 transition-colors"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={closeEditModal}
                className="flex-1 px-4 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium rounded-xl transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleUpdate}
                disabled={isUpdating || !editUrl}
                className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Güncelleniyor...' : 'Güncelle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {qrLink && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={closeQrModal}>
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-stone-100">QR Kod</h3>
              <button
                onClick={closeQrModal}
                className="p-2 hover:bg-stone-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* QR Kod */}
              <div className="flex justify-center">
                <div className="relative p-6 bg-white rounded-3xl shadow-2xl shadow-amber-500/20">
                  {qrLink && (
                    <QRCode
                      ref={qrRef}
                      value={`${baseUrl}/${qrLink.short_code}`}
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
                  )}
                </div>
              </div>

              <div className="p-4 bg-stone-800/50 border border-stone-700 rounded-xl">
                <p className="text-amber-500 font-mono text-sm text-center break-all">
                  {baseUrl.replace('http://', '').replace('https://', '')}/{qrLink.short_code}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={downloadQR}
                  className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  İndir
                </button>
                <button
                  onClick={() => copyToClipboard(qrLink.short_code, qrLink.id)}
                  className="flex-1 px-4 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {copiedId === qrLink.id ? (
                    <>
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-500">Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Kopyala
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deletingLink && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={closeDeleteModal}>
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-stone-100">Linki Sil</h3>
              <button
                onClick={closeDeleteModal}
                className="p-2 hover:bg-stone-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-red-400 font-medium mb-1">Bu işlem geri alınamaz!</p>
                    <p className="text-stone-400 text-sm">
                      Link kalıcı olarak silinecek ve artık kullanılamayacak.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-800/50 border border-stone-700 rounded-xl">
                <p className="text-stone-400 text-sm mb-2">Silinecek link:</p>
                <p className="text-amber-500 font-mono text-sm break-all">
                  {baseUrl.replace('http://', '').replace('https://', '')}/{deletingLink.short_code}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  İptal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Siliniyor...' : 'Sil'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
