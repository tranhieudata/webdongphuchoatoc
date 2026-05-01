import express from 'express';
import multer from 'multer';
import path from 'path';
import { FabricSampleModel } from '../models/FabricSample.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `fabric-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET all - public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { status } : { status: 'published' };
    const items = await FabricSampleModel.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await FabricSampleModel.countDocuments(query);
    res.json({ items, total, totalPages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET all for admin (includes drafts)
router.get('/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: 'i' };
    const items = await FabricSampleModel.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await FabricSampleModel.countDocuments(query);
    res.json({ items, total, totalPages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET by slug - public
router.get('/:slug', async (req, res) => {
  try {
    const item = await FabricSampleModel.findOne({ slug: req.params.slug, status: 'published' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create - admin
router.post('/create', authMiddleware, adminMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, status, order, slug } = req.body;
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    const item = new FabricSampleModel({ title, description, status, order: order || 0, images });
    if (slug) item.slug = slug;
    await item.save();
    res.status(201).json({ message: 'Created', item });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT update - admin
router.put('/:id', authMiddleware, adminMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    const item = await FabricSampleModel.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    const { title, description, status, order, slug, keepImages } = req.body;
    if (title) item.title = title;
    if (description !== undefined) item.description = description;
    if (status) item.status = status;
    if (order !== undefined) item.order = Number(order);
    if (slug) item.slug = slug;
    // Append new images or replace
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => `/uploads/${f.filename}`);
      item.images = keepImages === 'true' ? [...(item.images || []), ...newImages] : newImages;
    }
    await item.save();
    res.json({ message: 'Updated', item });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE - admin
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await FabricSampleModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export { router as FabricSampleRoute };
