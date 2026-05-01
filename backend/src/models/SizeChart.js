import mongoose from 'mongoose';
import slugify from 'slugify';

const sizeChartSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String, default: '' },
  images: [{ type: String }],
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

sizeChartSchema.pre('save', async function (next) {
  if (this.isModified('title') || this.isNew) {
    let base = slugify(this.title, { lower: true, strict: true, locale: 'vi' });
    const existing = await mongoose.model('SizeChart').findOne({ slug: base, _id: { $ne: this._id } });
    this.slug = existing ? `${base}-${Date.now()}` : base;
  }
  next();
});

const SizeChartModel = mongoose.model('SizeChart', sizeChartSchema);
export { SizeChartModel };
