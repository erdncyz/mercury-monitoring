# Mercury Monitoring

A modern, open-source uptime and status monitoring platform inspired by Uptime Kuma. Mercury Monitoring provides real-time website, API, and service monitoring with beautiful dashboards, incident management, and notification integrations.

## Features

- **Real-time Uptime Monitoring**: Track the status and response time of your websites, APIs, and services.
- **Customizable Monitors**: HTTP(s), TCP, Ping, DNS, and keyword monitoring support.
- **Beautiful Dashboard**: Responsive UI with modern charts and statistics.
- **Incident Management**: Automatic incident creation and status updates when downtime is detected.
- **Notification Integrations**: Email, webhook, Slack, Discord, Telegram, and more (extensible).
- **Pause/Resume Monitors**: Temporarily disable or resume monitoring for any service.
- **History & Analytics**: View uptime history, response time trends, and incident logs.
- **Authentication**: Secure login and protected routes.
- **Easy Setup**: Runs locally with Node.js, Express, React, and SQLite.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Recharts
- **Backend**: Node.js, Express, SQLite

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/mercury-monitoring.git
   cd mercury-monitoring
   ```

2. **Install dependencies for both frontend and backend:**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   # Install frontend dependencies
   cd ../
   npm install
   ```

3. **Start the backend server:**
   ```bash
   cd backend
   node index.js
   # The backend will run on http://localhost:3001
   ```

4. **Start the frontend app:**
   ```bash
   cd ../
   npm run dev
   # The frontend will run on http://localhost:5173
   ```

5. **Access Mercury Monitoring:**
   - Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

- **Add a Monitor:** Click "Add Monitor" and fill in the details for your website, API, or service.
- **Pause/Resume:** Use the pause/play button on any monitor card to temporarily disable or resume monitoring.
- **View Incidents:** Incidents are automatically created when a monitor goes down. View and manage them from the Incidents section.
- **Dashboard:** See real-time stats, uptime history, and response time analytics.

## Folder Structure

```
mercury-monitoring/
  backend/           # Express + SQLite backend
    index.js         # Main backend server
    mercury.db       # SQLite database
    ...
  src/               # React frontend source
    components/      # UI components
    hooks/           # Custom React hooks
    types/           # TypeScript types
    ...
  ...
```

## Contributing

Contributions are welcome! Please open issues or pull requests for bug fixes, new features, or improvements.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## License

This project is licensed under the MIT License.

## 🎯 Kullanım

### Dashboard
- Sistem genel durumunu görüntüleyin
- Uptime ve response time grafiklerini inceleyin
- Aktif incident'leri takip edin

### Monitor Yönetimi
- **Monitor Ekleme**: Yeni web servisi izlemesi ekleyin
- **Monitor Düzenleme**: Mevcut monitor'ları güncelleyin
- **Monitor Silme**: Gereksiz monitor'ları kaldırın
- **Pause/Resume**: Monitor'ları geçici olarak durdurun/başlatın

### Incident Yönetimi
- Yeni incident'ler oluşturun
- Mevcut incident'leri güncelleyin
- Incident geçmişini görüntüleyin

### Maintenance Windows
- Planlı bakım pencereleri oluşturun
- Bakım sürelerini yönetin
- Kullanıcıları bilgilendirin

### SSL Sertifika İzleme
- SSL sertifikalarının geçerlilik sürelerini takip edin
- Yaklaşan son kullanma tarihlerini görüntüleyin

### Bildirim Ayarları
- Email, Slack, webhook bildirimleri yapılandırın
- Bildirim kanallarını yönetin

### Kullanıcı Yönetimi
- Kayıt olun
- Giriş yapın
- Profil bilgilerinizi güncelleyin
- Çıkış yapın

## 📊 Mock Veriler

Proje şu anda mock veriler kullanmaktadır. Gerçek bir backend entegrasyonu için:

1. `src/data/mockData.ts` dosyasını gerçek API çağrıları ile değiştirin
2. `src/hooks/useMonitors.ts` hook'unu gerçek API endpoint'leri ile güncelleyin

## 🚀 Production Build

Production için build oluşturmak için:

```bash
npm run build
```

Build dosyaları `dist/` klasöründe oluşturulacaktır.

## 🧪 Geliştirme

### Linting
```bash
npm run lint
```

### Preview Build
```bash
npm run preview
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🐛 Bilinen Sorunlar

- Şu anda mock veriler kullanılmaktadır
- Gerçek zamanlı güncellemeler için WebSocket entegrasyonu gereklidir
- SSL sertifika kontrolü için gerçek API entegrasyonu gereklidir

## 🔮 Gelecek Planları

- [ ] Gerçek backend API entegrasyonu
- [ ] WebSocket ile gerçek zamanlı güncellemeler
- [ ] Daha fazla bildirim kanalı (SMS, Telegram, Discord)
- [ ] Gelişmiş grafik ve analitik
- [ ] Multi-tenant desteği
- [ ] API rate limiting
- [ ] Gelişmiş güvenlik özellikleri # mercury-monitoring
