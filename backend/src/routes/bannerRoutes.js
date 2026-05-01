import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import Banner from '../models/Banner.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all banners
router.get('/', async (req, res) => {
    try {
        const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new banner
router.post('/', adminMiddleware, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng tải lên ảnh' });
        }

        const banner = new Banner({
            title: req.body.title,
            subtitle: req.body.subtitle || '',
            desc: req.body.desc || '',
            cta: req.body.cta || 'Xem Thêm',
            href: req.body.href || '#',
            imageUrl: `/uploads/${req.file.filename}`,
            bg: req.body.bg || 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
            accent: req.body.accent || '#fff',
            status: req.body.status || 'active',
            order: req.body.order || 0
        });

        const newBanner = await banner.save();
        res.status(201).json(newBanner);
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(400).json({ message: error.message });
    }
});

// Update banner status
router.patch('/:id/status', adminMiddleware, async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        banner.status = req.body.status;
        const updatedBanner = await banner.save();
        res.json(updatedBanner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update banner (all fields)
router.put('/:id', adminMiddleware, upload.single('image'), async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        if (req.body.title) banner.title = req.body.title;
        if (req.body.subtitle !== undefined) banner.subtitle = req.body.subtitle;
        if (req.body.desc !== undefined) banner.desc = req.body.desc;
        if (req.body.cta) banner.cta = req.body.cta;
        if (req.body.href) banner.href = req.body.href;
        if (req.body.bg) banner.bg = req.body.bg;
        if (req.body.accent) banner.accent = req.body.accent;
        if (req.body.status) banner.status = req.body.status;
        if (req.body.order !== undefined) banner.order = req.body.order;

        // If new image uploaded
        if (req.file) {
            // Delete old image
            const oldImagePath = path.join(__dirname, '../../../', banner.imageUrl);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
            banner.imageUrl = `/uploads/${req.file.filename}`;
        }

        const updatedBanner = await banner.save();
        res.json(updatedBanner);
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(400).json({ message: error.message });
    }
});

// Delete banner
router.delete('/:id', adminMiddleware, async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        // Delete the image file
        const imagePath = path.join(__dirname, '../../../', banner.imageUrl);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await banner.deleteOne();
        res.json({ message: 'Banner deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export const BannerRoute = router;
