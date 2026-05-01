import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        default: ''
    },
    desc: {
        type: String,
        default: ''
    },
    cta: {
        type: String,
        default: 'Xem Thêm'
    },
    href: {
        type: String,
        default: '#'
    },
    imageUrl: {
        type: String,
        required: true
    },
    bg: {
        type: String,
        default: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)'
    },
    accent: {
        type: String,
        default: '#fff'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model('Banner', bannerSchema);