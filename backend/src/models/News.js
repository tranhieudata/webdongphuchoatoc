import mongoose from "mongoose";
import slugify from "slugify";

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: { type: String, required: true },
    slug: { 
        type: String, 
        unique: true,
        sparse: true
    },
    excerpt: {
        type: String,
        maxLength: 300
    },
    metaDescription: {
        type: String,
        maxLength: 200
    },
    featuredImage: {
        type: String
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    tags: [{
        type: String
    }],
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

newsSchema.pre('save', async function(next) {
    if (this.isModified('title') || this.isNew) {
        let generatedSlug = slugify(this.title, { 
            lower: true, 
            strict: true,
            locale: 'vi',
            remove: /[*+~.()'"!:@]/g
        });

        const existingNews = await mongoose.model('News').findOne({ 
            slug: generatedSlug,
            _id: { $ne: this._id }
        });

        if (existingNews) {
            this.slug = `${generatedSlug}-${Date.now()}`;
        } else {
            this.slug = generatedSlug;
        }
    }
    next();
});

const NewsModel = mongoose.model('News', newsSchema);
export { NewsModel };