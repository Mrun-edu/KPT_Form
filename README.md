# Kariyer Persona Testi - Standalone Uygulama

Bu uygulama, kariyer persona testini bağımsız bir sunucuda çalıştırmanıza ve 100 kişiden veri toplamanıza olanak sağlar.

## 🎯 Özellikler

- ✅ Basit isim-soyisim ile giriş
- ✅ 3 modüllü test sistemi (Beceriler, İlgiler, Değerler)
- ✅ Otomatik persona hesaplama
- ✅ MongoDB'de veri saklama
- ✅ Veri export özelliği
- ✅ Responsive tasarım

## 📋 Gereksinimler

- Node.js (v18 veya üzeri)
- MongoDB (v5 veya üzeri)
- npm veya yarn

## 🚀 Kurulum

### 1. Depoyu Klonlayın veya İndirin

```bash
cd standalone-app
```

### 2. Backend Kurulumu

```bash
cd server
npm install
```

`.env` dosyasını düzenleyin:
```env
MONGODB_URI=mongodb://localhost:27017/kariyer-persona-test
PORT=3001
CLIENT_URL=http://localhost:5174
```

### 3. Frontend Kurulumu

```bash
cd ../client
npm install
```

### 4. MongoDB'yi Başlatın

MongoDB'nin çalıştığından emin olun:
```bash
# Linux/Mac
sudo systemctl start mongod

# veya Docker ile
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 🎮 Çalıştırma

### Development Modu

İki ayrı terminal açın:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresini açın.

### Production Build

**Frontend Build:**
```bash
cd client
npm run build
```

**Backend Çalıştırma:**
```bash
cd server
npm start
```

## 📊 Veri Export

### API Üzerinden Export

```bash
curl http://localhost:3001/api/export > sonuclar.json
```

### İstatistikleri Görüntüleme

```bash
curl http://localhost:3001/api/stats
```

Çıktı:
```json
{
  "success": true,
  "stats": {
    "toplamKullanici": 100,
    "tamamlananTest": 95,
    "bekleyenTest": 5
  }
}
```

## 🗄️ Veritabanı Yapısı

### Users Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  testCompleted: Boolean,
  createdAt: Date
}
```

### TestResults Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  answers: {
    skills: Object,
    interests: Object,
    values: Object
  },
  results: {
    top3Personas: Object,
    radarChartData: Array,
    qualityFlags: Object,
    moduleScores: Object,
    compositeScores: Object,
    appliedWeights: Object
  },
  completedAt: Date
}
```

## 📁 Proje Yapısı

```
standalone-app/
├── server/                 # Backend
│   ├── models/            # MongoDB modelleri
│   ├── routes/            # API rotaları
│   ├── server.js          # Ana sunucu dosyası
│   └── package.json
│
├── client/                # Frontend
│   ├── src/
│   │   ├── components/    # React bileşenleri
│   │   ├── data/          # Test verileri
│   │   ├── utils/         # Puanlama algoritması
│   │   ├── App.tsx        # Ana uygulama
│   │   └── main.tsx       # Entry point
│   ├── index.html
│   └── package.json
│
└── README.md
```

## 🔧 API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/users` | Yeni kullanıcı kaydı |
| POST | `/api/results` | Test sonuçlarını kaydet |
| GET | `/api/export` | Tüm sonuçları export et |
| GET | `/api/stats` | İstatistikleri görüntüle |
| GET | `/health` | Sunucu sağlık kontrolü |

## 🎨 Kullanıcı Akışı

1. **Giriş**: Kullanıcı isim ve soyisim girer
2. **Beceriler Testi**: 24 soru (1-5 skala)
3. **İlgiler Testi**: 12 blok (4'lü sıralama)
4. **Değerler Testi**: 24 soru (1-5 skala)
5. **Sonuçlar**: Top 3 persona gösterimi
6. **Kayıt**: Otomatik MongoDB'ye kayıt

## 🔒 Güvenlik Notları

- Bu uygulama basit bir veri toplama aracıdır
- Production ortamında ek güvenlik önlemleri alınmalıdır:
  - HTTPS kullanımı
  - Rate limiting
  - Input validation
  - CORS ayarlarının güncellenmesi

## 🐛 Sorun Giderme

### MongoDB Bağlantı Hatası
```bash
# MongoDB'nin çalıştığını kontrol edin
sudo systemctl status mongod

# Veya Docker ile
docker ps | grep mongodb
```

### Port Çakışması
`.env` dosyasında farklı portlar kullanın:
```env
PORT=3002
```

### Frontend Build Hatası
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

## 📞 Destek

Sorularınız için:
- GitHub Issues
- Email: support@example.com

## 📄 Lisans

MIT License

---

**Not**: Bu uygulama 100 kişiden veri toplamak için tasarlanmıştır. Daha fazla kullanıcı için performans optimizasyonları gerekebilir.
