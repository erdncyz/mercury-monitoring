# Mercury Monitoring Backend

Bu klasör Mercury Monitoring uygulamasının Node.js tabanlı backend API'sini içerir.

## Özellikler
- Express tabanlı REST API
- SQLite veritabanı
- Monitör CRUD işlemleri
- Genişletilebilir altyapı (incident, status page, bildirim, kullanıcı, vs.)

## Kurulum

```bash
cd backend
npm install
node index.js
```

API varsayılan olarak `http://localhost:3001` adresinde çalışır.

## Endpointler

- `GET    /api/monitors`   → Tüm monitörleri listeler
- `POST   /api/monitors`   → Yeni monitör ekler
- `PUT    /api/monitors/:id` → Monitörü günceller
- `DELETE /api/monitors/:id` → Monitörü siler

## Geliştirme
- Diğer modüller (incident, status page, bildirim, kullanıcı) eklenecektir. 