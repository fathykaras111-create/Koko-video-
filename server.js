const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API لجلب معلومات القائمة
app.post('/api/playlist-info', async (req, res) => {
    try {
        const { url } = req.body;
        const playlistId = extractPlaylistId(url);
        
        // هنا هنستخدم YouTube API حقيقية
        // دلوقتي بنرجع بيانات وهمية
        res.json({
            title: 'قائمة تشغيل تجريبية',
            videoCount: 10,
            videos: Array(10).fill().map((_, i) => ({
                id: `video${i}`,
                title: `فيديو ${i + 1}`,
                url: `https://youtube.com/watch?v=${i}`
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API لتحميل فيديو
app.get('/api/download', async (req, res) => {
    try {
        const { url, quality = 'highest' } = req.query;
        
        // معلومات الفيديو
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality });
        
        // إعدادات التحميل
        res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
        
        // بدأ التحميل
        ytdl(url, { format })
            .pipe(res);
            
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('الموقع شغال على http://localhost:3000');
});