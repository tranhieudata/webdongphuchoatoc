import mongoose from "mongoose";
import slugify from "slugify";
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Product name is required
        trim: true,     // Remove extra spaces from the product name
      },
      description: {
        type: String,
        required: true, // Product description is required
        trim: true,     // Remove extra spaces
      },
      price: {
        type: Number,
        required: true, // Product price is required
        min: 0,         // Price must be a positive number
      },
      images: [{
        type: String,  // Lưu trữ URL của ảnh (có thể là từ dịch vụ lưu trữ bên ngoài)
        required: true,
      }],
      createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date to now
      },
      updatedAt: {
        type: Date,
        default: Date.now, // Automatically set the last update date to now
      },
      slug: {
        type: String,
        unique: true,
        required: false
      }
})

productSchema.pre('save', async function(next) {

    if (this.isModified('name') || this.isNew) {
        // Tạo slug từ name
        let generatedSlug = slugify(this.name, { lower: true, strict: true ,locale: 'vi'});

        // Kiểm tra xem slug đã tồn tại trong cơ sở dữ liệu chưa
        const existingProduct = await mongoose.model('Product').findOne({ slug: generatedSlug });
        if (existingProduct) {
            // Nếu slug đã tồn tại, tạo slug mới bằng cách thêm timestamp hoặc số đếm
            this.slug = `${generatedSlug}-${Date.now()}`;
        } else {
            // Nếu slug chưa tồn tại, sử dụng slug gốc
            this.slug = generatedSlug;
        }
    }
    next();
});

const ProductModel = mongoose.model('Product', productSchema);

export {ProductModel}