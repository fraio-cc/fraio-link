# 🔗 Fraio Link

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fraio-cc/fraio-link)
![License](https://img.shields.io/github/license/fraio-cc/fraio-link)
![Stars](https://img.shields.io/github/stars/fraio-cc/fraio-link)

Next.js 16, TypeScript ve Tailwind CSS ile geliştirilmiş modern, açık kaynaklı URL kısaltıcı.

## ✨ Özellikler

- **Hızlı & Basit** - Saniyeler içinde URL kısaltın
- **İstatistikler** - Tıklama sayısı, ülke ve referrer takibi
- **QR Kodlar** - Otomatik QR kod oluşturma
- **Güvenli** - Güvenilir ve emniyetli
- **API** - Geliştiriciler için RESTful API
- **Ücretsiz** - Açık kaynak ve sonsuza kadar ücretsiz
- **Anonim Kullanım** - Hesap olmadan link oluşturabilme
- **Kayıtlı Kullanıcı Avantajları** - Reklamsız yönlendirme ve link yönetimi

## 🛠️ Teknolojiler

- **Framework**: Next.js 16
- **Dil**: TypeScript
- **Stil**: Tailwind CSS 4
- **Veritabanı**: PostgreSQL (Neon/Supabase kullanılan)

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+
- PostgreSQL veritabanı

### Adımlar

```bash
# Repoyu klonlayın
git clone https://github.com/fraio-cc/fraio-link.git
cd fraio-link

# Bağımlılıkları yükleyin
npm install

# Ortam değişkenlerini ayarlayın
cp .env.example .env.local

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📝 Ortam Değişkenleri

```env
# Veritabanı
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# OAuth (Google) opsiyonel
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth (Discord) opsiyonel
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 🎯 Özellik Detayları

### Anonim vs Kayıtlı Kullanıcı

**Anonim Kullanıcılar:**
- Link oluşturabilir
- 1 saniyelik reklam gösterilir
- Link yönetimi yok

**Kayıtlı Kullanıcılar:**
- Anında yönlendirme (reklamsız)
- Dashboard'dan link yönetimi
- Link düzenleme ve silme
- Detaylı istatistikler

### API Özellikleri

- Herkese açık API (kimlik doğrulama gerekmez)
- IP bazlı rate limiting (saatte 30 istek)
- Detaylı istatistikler (tıklama, ülke, referrer)
- RESTful endpoint'ler

Detaylı API dokümantasyonu için [API.md](./API.md) dosyasına veya sitedeki docs a bakın.

## 🗄️ Veritabanı

PostgreSQL kullanılır. Migration dosyaları `migrations/` klasöründe bulunur.

Ana tablolar:
- `links` - Kısaltılmış linkler
- `link_clicks` - Tıklama detayları
- `users` - Kullanıcı bilgileri (ana site ile paylaşımlı)

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Pull Request göndermekten çekinmeyin.

## 📄 Lisans

MIT License - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🔗 Bağlantılar

- **Website**: [link.fraio.cc](https://link.fraio.cc)
- **Ana Site**: [fraio.cc](https://fraio.cc)
- **Dokümantasyon**: [fraio.cc/docs/link](https://fraio.cc/docs/link)
- **Discord**: [Topluluğumuza katılın](https://fraio.cc/discord)

---

❤️ ile yapıldı - [Fraio Studio](https://fraio.cc)
