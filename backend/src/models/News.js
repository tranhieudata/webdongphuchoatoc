import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Tham chiếu đến bảng 'User'
        required: true
    },
    content: { type: String, required: true },
    slug: { 
        type: String, 
        unique:true,
        required: true },
}, { timestamps: true });

newsSchema.pre('save', async function(next) {


    if (this.isModified('name') || this.isNew) {
        // Tạo slug từ name
        let generatedSlug = slugify(this.title, { lower: true, strict: true ,locale: 'vi'});

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


const NewsModel = mongoose.model('News', newsSchema);
export {NewsModel};