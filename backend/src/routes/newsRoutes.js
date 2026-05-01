import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { NewsModel } from '../models/News.js';
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

// Get all blog posts (with pagination and filters)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { status, tag, search } = req.query;
        const query = {};

        if (status) {
            query.status = status;
        }

        if (tag) {
            query.tags = tag;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        const posts = await NewsModel.find(query)
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await NewsModel.countDocuments(query);

        res.json({
            posts,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single blog post by ID (for admin editing)
router.get('/by-id/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const post = await NewsModel.findById(req.params.id).populate('author', 'username');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json({ post });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single blog post by slug
router.get('/:slug', async (req, res) => {
    try {
        const post = await NewsModel.findOne({ slug: req.params.slug })
            .populate('author', 'username');
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Increment view count
        post.views += 1;
        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new blog post
router.post('/', authMiddleware, adminMiddleware, upload.single('featuredImage'), async (req, res) => {
    try {
        const { title, content, metaDescription, excerpt, tags, status, slug } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        console.log('📝 Creating post:', { title: title.slice(0, 50), hasContent: !!content, author: req.user.id });

        const post = new NewsModel({
            title,
            content,
            metaDescription,
            excerpt,
            tags: tags ? JSON.parse(tags) : [],
            status: status || 'draft',
            author: req.user.id,
            featuredImage: req.file ? `/uploads/${req.file.filename}` : undefined
        });

        const newPost = await post.save();
        console.log('✅ Post created:', { slug: newPost.slug, id: newPost._id, contentLength: newPost.content?.length || 0 });
        res.status(201).json(newPost);
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.error('❌ Create error:', error.message);
        res.status(400).json({ message: error.message });
    }
});

// Update blog post
router.put('/:id', authMiddleware, adminMiddleware, upload.single('featuredImage'), async (req, res) => {
    try {
        const post = await NewsModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const updates = {
            title: req.body.title || post.title,
            content: req.body.content || post.content,
            metaDescription: req.body.metaDescription || post.metaDescription,
            excerpt: req.body.excerpt || post.excerpt,
            tags: req.body.tags ? JSON.parse(req.body.tags) : post.tags,
            status: req.body.status || post.status
        };

        if (req.body.slug && req.body.slug !== post.slug) {
            updates.slug = req.body.slug;
        }

        if (req.file) {
            // Delete old image if it exists
            if (post.featuredImage) {
                const oldImagePath = path.join(__dirname, '../../../', post.featuredImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            updates.featuredImage = `/uploads/${req.file.filename}`;
        }

        const updatedPost = await NewsModel.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).populate('author', 'username');

        res.json(updatedPost);
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(400).json({ message: error.message });
    }
});

// Delete blog post
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const post = await NewsModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Delete featured image if it exists
        if (post.featuredImage) {
            const imagePath = path.join(__dirname, '../../../', post.featuredImage);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await post.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export const NewsRoute = router;
