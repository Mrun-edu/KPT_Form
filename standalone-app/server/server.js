import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kariyer-persona-test';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB bağlantısı başarılı');
        console.log(`📊 Database: ${MONGODB_URI}`);
    })
    .catch((error) => {
        console.error('❌ MongoDB bağlantı hatası:', error);
        process.exit(1);
    });

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Kariyer Persona Test API çalışıyor',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint bulunamadı'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Sunucu hatası',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server çalışıyor: http://localhost:${PORT}`);
    console.log(`🌐 Client URL: ${CLIENT_URL}`);
    console.log(`📝 API Endpoints:`);
    console.log(`   POST /api/users - Yeni kullanıcı kaydı`);
    console.log(`   POST /api/results - Test sonuçlarını kaydet`);
    console.log(`   GET  /api/export - Tüm sonuçları export et`);
    console.log(`   GET  /api/stats - İstatistikleri görüntüle`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM sinyali alındı, sunucu kapatılıyor...');
    mongoose.connection.close(() => {
        console.log('MongoDB bağlantısı kapatıldı');
        process.exit(0);
    });
});
