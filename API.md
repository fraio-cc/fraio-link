# Fraio Link API Dokümantasyonu

## Kimlik Doğrulama

API herkese açıktır ve kimlik doğrulama gerektirmez. Sadece link kısa kodunu bilmeniz yeterlidir.

## Endpoints

### 1. Link İstatistikleri

Belirli bir linkin detaylı istatistiklerini getirir.

**Endpoint:** `GET /api/stats/{short_code}`

**Parametreler:**
- `short_code` (path): Link kısa kodu (örn: `hwIDA0h`)

**Yetkilendirme:**
- Kimlik doğrulama gerekmez
- Rate limit: IP başına saatte 30 istek

**Response Headers:**
- `X-RateLimit-Limit`: Maksimum istek sayısı (30)
- `X-RateLimit-Remaining`: Kalan istek sayısı
- `X-RateLimit-Reset`: Rate limit sıfırlanma zamanı (ISO 8601)

**Başarılı Yanıt (200):**
```json
{
  "link": {
    "short_code": "hwIDA0h",
    "original_url": "https://fraio.cc",
    "created_at": "2026-01-15T10:30:00Z",
    "is_active": true
  },
  "stats": {
    "total_clicks": 150,
    "clicks_by_date": {
      "2026-01-15": 45,
      "2026-01-16": 67,
      "2026-01-17": 38
    },
    "clicks_by_country": {
      "TR": 120,
      "US": 20,
      "DE": 10
    },
    "clicks_by_referrer": {
      "Direkt": 80,
      "https://discord.com": 40,
      "https://facebook.com": 30
    }
  },
  "recent_clicks": [
    {
      "clicked_at": "2026-01-17T15:45:00Z",
      "country": "TR",
      "referrer": "https://discord.com"
    }
  ]
}
```

**Hata Yanıtları:**

404 - Link Bulunamadı:
```json
{
  "error": "Link bulunamadı"
}
```

429 - Çok Fazla İstek:
```json
{
  "error": "Çok fazla istek",
  "message": "Saatte en fazla 30 istek yapabilirsiniz",
  "resetAt": "2026-01-17T16:45:00Z"
}
```

500 - Sunucu Hatası:
```json
{
  "error": "İstatistikler alınamadı"
}
```

## Kullanım Örnekleri

### JavaScript/Fetch
```javascript
const response = await fetch('https://link.fraio.cc/api/stats/hwIDA0h');

// Rate limit bilgilerini kontrol et
const remaining = response.headers.get('X-RateLimit-Remaining');
const reset = response.headers.get('X-RateLimit-Reset');

if (response.status === 429) {
  console.log('Rate limit aşıldı, sıfırlanma:', reset);
  return;
}

const data = await response.json();
console.log('Toplam tıklama:', data.stats.total_clicks);
console.log('Kalan istek hakkı:', remaining);
```

### cURL
```bash
curl -X GET 'https://link.fraio.cc/api/stats/hwIDA0h'
```

### Python
```python
import requests

# İstatistikleri al
response = requests.get('https://link.fraio.cc/api/stats/hwIDA0h')
data = response.json()
print(f"Toplam tıklama: {data['stats']['total_clicks']}")
```

## Notlar

- API herkese açıktır, kimlik doğrulama gerektirmez
- İstatistikler gerçek zamanlı güncellenir
- Son 10 tıklama detayı döndürülür
- Tüm tarihler ISO 8601 formatındadır
- Rate limiting IP adresi bazlıdır
