import express from 'express';
import User from '../models/User.js';
import TestResult from '../models/TestResult.js';

const router = express.Router();

// Create new user (login/register)
router.post('/users', async (req, res) => {
    try {
        const { firstName, lastName } = req.body;

        if (!firstName || !lastName) {
            return res.status(400).json({
                error: 'İsim ve soyisim gereklidir'
            });
        }

        const user = new User({
            firstName: firstName.trim(),
            lastName: lastName.trim()
        });

        await user.save();

        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (error) {
        console.error('User creation error:', error);
        res.status(500).json({
            error: 'Kullanıcı oluşturulurken bir hata oluştu'
        });
    }
});

// Save test results
router.post('/results', async (req, res) => {
    try {
        const { userId, answers, results } = req.body;

        if (!userId || !answers || !results) {
            return res.status(400).json({
                error: 'Eksik veri gönderildi'
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: 'Kullanıcı bulunamadı'
            });
        }

        // Create test result
        const testResult = new TestResult({
            userId,
            answers,
            results
        });

        await testResult.save();

        // Update user's test completion status
        user.testCompleted = true;
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Test sonuçları başarıyla kaydedildi',
            resultId: testResult._id
        });
    } catch (error) {
        console.error('Test result save error:', error);
        res.status(500).json({
            error: 'Sonuçlar kaydedilirken bir hata oluştu'
        });
    }
});

// Get all results (for export)
router.get('/export', async (req, res) => {
    try {
        const results = await TestResult.find()
            .populate('userId', 'firstName lastName createdAt')
            .sort({ completedAt: -1 });

        const exportData = results.map(result => ({
            kullanici: {
                id: result.userId._id,
                isim: result.userId.firstName,
                soyisim: result.userId.lastName,
                kayitTarihi: result.userId.createdAt
            },
            testTarihi: result.completedAt,
            sonuclar: {
                altinPersona: result.results.top3Personas.gold,
                gumusPersona: result.results.top3Personas.silver,
                bronzPersona: result.results.top3Personas.bronze
            },
            kaliteBayraklari: result.results.qualityFlags,
            modulPuanlari: result.results.moduleScores,
            bileşikPuanlar: result.results.compositeScores
        }));

        res.json({
            success: true,
            count: exportData.length,
            data: exportData
        });
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({
            error: 'Veriler export edilirken bir hata oluştu'
        });
    }
});

// Get statistics
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const completedTests = await User.countDocuments({ testCompleted: true });
        const pendingTests = totalUsers - completedTests;

        res.json({
            success: true,
            stats: {
                toplamKullanici: totalUsers,
                tamamlananTest: completedTests,
                bekleyenTest: pendingTests
            }
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({
            error: 'İstatistikler alınırken bir hata oluştu'
        });
    }
});

export default router;
