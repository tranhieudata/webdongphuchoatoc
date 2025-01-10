// models/category.js
import mongoose from "mongoose";
import slugify from "slugify";

// Định nghĩa schema cho Category
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    required: false
  }
}, { timestamps: true });

// Pre-save middleware để tạo slug
categorySchema.pre('save', async function(next) {


    if (this.isModified('name') || this.isNew) {
        // Tạo slug từ name
        let generatedSlug = slugify(this.name, { lower: true, strict: true ,locale: 'vi'});

        // Kiểm tra xem slug đã tồn tại trong cơ sở dữ liệu chưa
        const existingCategory = await mongoose.model('Category').findOne({ slug: generatedSlug });
        if (existingCategory) {
            // Nếu slug đã tồn tại, tạo slug mới bằng cách thêm timestamp hoặc số đếm
            this.slug = `${generatedSlug}-${Date.now()}`;
        } else {
            // Nếu slug chưa tồn tại, sử dụng slug gốc
            this.slug = generatedSlug;
        }
    }

    next();
});


const CategoryModel = mongoose.model('Category', categorySchema);

export { CategoryModel };
