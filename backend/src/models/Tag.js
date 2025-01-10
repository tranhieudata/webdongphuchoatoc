import mongoose from "mongoose";
import slugify from "slugify";
const tagSchema = new mongoose.Schema({
    name: {type:String, require:true},
    slug: {type:String, unique: true,require:false},
}, { timestamps: true })
// Pre-save middleware để tạo slug
tagSchema.pre('save', async function(next) {
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


const TagModel = mongoose.model('Tag', tagSchema);
export {TagModel}
