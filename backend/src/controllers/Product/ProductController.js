import mongoose from 'mongoose';

//import { Product } from '../../models/product.js';
import {ProductModel} from '../../models/Product.js'
import { CategoryModel } from '../../models/category.js';
import { TagModel } from '../../models/tag.js';
import { ProductCategory } from '../../models/ProductCategory.js';
import { ProductTag } from '../../models/ProductTag.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import slugify from 'slugify';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// Lấy __filename từ import.meta.url
const __filename = fileURLToPath(import.meta.url);

// Lấy __dirname từ __filename
const __dirname = dirname(__filename);



// const ProductModel = mongoose.model("Product",Product)
const ProductCategoryModel = mongoose.model("ProductCategory",ProductCategory)
const ProductTagModel = mongoose.model("ProductTag",ProductTag)

const arraysAreEqual =(arr1, arr2)=>{
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}
// Thiết lập thư mục lưu trữ và têácn file ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Lưu ảnh vào thư mục 'uploads'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file là thời gian hiện tại + phần mở rộng của file
  }
});

// Kiểm tra loại file (chỉ cho phép file ảnh)
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Chỉ cho phép tải lên các file ảnh', false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Giới hạn dung lượng ảnh tải lên (ở đây là 10MB)
}).array('images', 5); // Hỗ trợ tải lên nhiều ảnh (tối đa 5 ảnh)
class ProductController {
  // Tạo mới sản phẩm và quan hệ với Category và Tag
  async createProduct(req, res) {
    try {
      // Xử lý upload ảnh
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: err });
        }
  
        const { name, description, price, categoryIds, tagIds } = req.body;
      
        // Tạo sản phẩm mới với ảnh đã tải lên
        const imagePaths = req.files.map(file => file.path); // Lấy các đường dẫn ảnh đã tải lên
  
        const newProduct = new ProductModel({
          name,
          description,
          price,
          images: imagePaths, // Lưu mảng các đường dẫn ảnh
        });
  
        await newProduct.save();
        
        // Thêm các quan hệ với Category
        for (const categoryId of categoryIds.split(',')) {
          
          await ProductCategoryModel.create({
            productId: newProduct._id,
            categoryId: categoryId,
          });
        }
  
        // Thêm các quan hệ với Tag
        for (const tagId of tagIds.split(',')) {
          await ProductTagModel.create({
            productId: newProduct._id,
            tagId: tagId,
          });
        }
  
        return res.status(201).json({
          message: 'Product created successfully',
          product: newProduct,
        });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  

// Lấy tất cả sản phẩm với phân trang
async getAllProductsByPage(req, res) {
  try {
    const { page = 1, limit = 12 } = req.query; // Lấy page và limit từ query string, mặc định là page 1 và limit 10

    // Chuyển đổi page và limit thành số
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Tính toán số lượng sản phẩm cần bỏ qua (skip)
    const skip = (pageNumber - 1) * limitNumber;

    // Truy vấn với phân trang (skip và limit)
    const products = await ProductModel.find()
      .skip(skip) // Bỏ qua các sản phẩm từ các trang trước
      .limit(limitNumber); // Giới hạn số lượng sản phẩm trên mỗi trang

    // Lấy tổng số sản phẩm để tính toán tổng số trang
    const totalProducts = await ProductModel.countDocuments();

    // Tính toán số trang
    const totalPages = Math.ceil(totalProducts / limitNumber);
    const remainingProducts = totalProducts - (pageNumber * limitNumber);
    return res.status(200).json({
      message: 'Products retrieved successfully',
      products,
      page: pageNumber,
      totalPages: totalPages,
      totalProducts: totalProducts,
      remainingProducts: remainingProducts > 0 ? remainingProducts : 0, // Đảm bảo không có giá trị âm
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}


  // Lấy tất cả sản phẩm theo thẻ tagId
  // Lấy tất cả sản phẩm theo slug của category (categorySlug)
async getProductsByCategory(req, res) {
  try {
    const categorySlug = req.params.slug; // Lấy categorySlug từ tham số URL
    const { page = 1, limit = 12 } = req.query;

    // Chuyển page và limit thành số
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Tính toán số lượng cần bỏ qua (skip)
    const skip = (pageNumber - 1) * limitNumber;

    // Lấy thông tin danh mục theo categorySlug
    const category = await CategoryModel.findOne({ slug: categorySlug });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Lấy danh sách các productId thuộc categoryId
    const productCategories = await ProductCategoryModel.find({ categoryId: category._id })
      .skip(skip)  // Bỏ qua các sản phẩm ở các trang trước
      .limit(limitNumber); // Giới hạn số sản phẩm trả về

    if (!productCategories || productCategories.length === 0) {
      return res.status(404).json({ message: 'No products found for this category' });
    }

    // Lấy tất cả productId từ kết quả trên
    const productIds = productCategories.map(item => item.productId);

    // Lấy tất cả sản phẩm từ bảng Product có productId trong danh sách
    const products = await ProductModel.find({ _id: { $in: productIds } });

    // Lấy tổng số sản phẩm để tính toán tổng số trang
    const totalProducts = await ProductCategoryModel.countDocuments({ categoryId: category._id });

    const totalPages = Math.ceil(totalProducts / limitNumber);
    const remainingProducts = totalProducts - (pageNumber * limitNumber);

    return res.status(200).json({
      message: 'Products found',
      products,
      totalPages,
      currentPage: pageNumber,
      totalProducts,
      remainingProducts: remainingProducts > 0 ? remainingProducts : 0, // Đảm bảo không có giá trị âm
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}

  
  // Lấy sản phẩm và thông tin danh mục và tag
  async getProductsByTag(req, res) {
    try {
      const tagSlug = req.params.slug; // Lấy categorySlug từ tham số URL
      const { page = 1, limit = 12 } = req.query;
  
      // Chuyển page và limit thành số
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
  
      // Tính toán số lượng cần bỏ qua (skip)
      const skip = (pageNumber - 1) * limitNumber;
  
      // Lấy thông tin danh mục theo categorySlug
      const tag = await TagModel.findOne({ slug: tagSlug });
  
      if (!tag) {
        return res.status(404).json({ message: 'Tag not found' });
      }
  
      // Lấy danh sách các productId thuộc categoryId
      const productTags = await ProductTagModel.find({ tagId: tag._id })
        .skip(skip)  // Bỏ qua các sản phẩm ở các trang trước
        .limit(limitNumber); // Giới hạn số sản phẩm trả về
  
      if (!productTags || productTags.length === 0) {
        return res.status(404).json({ message: 'No products found for this tag' });
      }
  
      // Lấy tất cả productId từ kết quả trên
      const productIds = productTags.map(item => item.productId);
  
      // Lấy tất cả sản phẩm từ bảng Product có productId trong danh sách
      const products = await ProductModel.find({ _id: { $in: productIds } });
  
      // Lấy tổng số sản phẩm để tính toán tổng số trang
      const totalProducts = await ProductTagModel.countDocuments({ tagId: tag._id });
  
      const totalPages = Math.ceil(totalProducts / limitNumber);
      const remainingProducts = totalProducts - (pageNumber * limitNumber);
  
      return res.status(200).json({
        message: 'Products found',
        products,
        totalPages,
        currentPage: pageNumber,
        totalProducts,
        remainingProducts: remainingProducts > 0 ? remainingProducts : 0, // Đảm bảo không có giá trị âm
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  
  }
  
  
  async getProductById(req, res) {
    try {

      // Lấy sản phẩm
      const product = await ProductModel.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Lấy danh mục của sản phẩm từ bảng ProductCategory
      const categories = await ProductCategoryModel.find({ productId: req.params.id }).populate('categoryId');
      const tags = await ProductTagModel.find({ productId: req.params.id }).populate('tagId');
      return res.status(200).json({
        product,
        categories,
        tags,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  async getProductBySlug(req, res) {
    try {
      const Slug = req.params.slug; // Lấy categorySlug từ tham số URL
      // Lấy sản phẩm
      const product = await ProductModel.findOne({slug:Slug});

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Lấy danh mục của sản phẩm từ bảng ProductCategory
      const categories = await ProductCategoryModel.find({ productId: product._id }).populate('categoryId')
      const tags = await ProductTagModel.find({ productId: product._id }).populate('tagId')
      return res.status(200).json({
        product,
        categories,
        tags,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // Cập nhật quan hệ của sản phẩm theo Id
  async updateProductById(req, res) {
    
    try {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: err });
        }
      const id = req.params.id;
      const { name, description, price, images, categoryIds, tagIds , removedImages } = req.body;
      
      


      // Tìm sản phẩm theo ID
      const product = await ProductModel.findById(id);
      const current_categories = await ProductCategoryModel.find({ productId: product._id }).populate('categoryId')
      const current_tags = await ProductTagModel.find({ productId: product._id }).populate('tagId')
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Nếu tên sản phẩm thay đổi, cập nhật lại slug
      if (name && name !== product.name) {
        const generatedSlug = slugify(name, { lower: true, strict: true, locale: 'vi' });
  
        // Kiểm tra slug đã tồn tại hay chưa
        const existingProduct = await ProductModel.findOne({ slug: generatedSlug });
        let uniqueSlug = generatedSlug;
        let counter = 1;
  
        // Nếu slug đã tồn tại, tạo slug duy nhất
        while (existingProduct) {
          uniqueSlug = `${generatedSlug}-${counter}`;
          const checkSlug = await ProductModel.findOne({ slug: uniqueSlug });
          if (!checkSlug) {
            break;
          }
          counter++;
        }
  
        // Cập nhật lại slug
        product.slug = uniqueSlug;
      }
  
      // Cập nhật các trường còn lại của sản phẩm
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      
    // Nếu có ảnh mới, cập nhật ảnh cho sản phẩm
      let newImages = [];
      
      if (req.files && req.files.length > 0) {
        // Lấy các đường dẫn ảnh mới đã tải lên
        newImages = req.files.map(file => file.path);
        product.images = product.images.concat(newImages)
        
      } 
    
    
    // Xử lý việc xóa ảnh trong removedImages
    if (removedImages && removedImages.length > 0 ) {
      console.log("vào remove")
      
      const removedImages_ = Array.isArray(removedImages) ? removedImages : JSON.parse(removedImages);
      console.log(removedImages_)

      removedImages_.forEach((removedImage) => {
        // Xóa ảnh khỏi cơ sở dữ liệu
        if(typeof removedImage === 'string'){
          console.log(removedImage)
          const imagePath = path.join(__dirname, '..','..','..', removedImage); // Đảm bảo đường dẫn chính xác
          // Kiểm tra sự tồn tại của file
          if(fs.existsSync(imagePath)){
            product.images = product.images.filter((image) => image !== removedImage);
            fs.unlink(imagePath, (err) => {
              if (err) {
                console.error(`Error deleting removed image file: ${imagePath}`, err);
              }
            });
          }
        }
        
        
      });
    }

  
      // Cập nhật lại thời gian cập nhật
      product.updatedAt = Date.now();
  
      // Lưu lại sản phẩm đã cập nhật
      const updatedProduct = await product.save();
  
      // Kiểm tra và cập nhật quan hệ Category nếu có thay đổi


      
      if (categoryIds && !arraysAreEqual(categoryIds, current_categories)) {


        // Xóa các quan hệ cũ với Category
        await ProductCategoryModel.deleteMany({ productId: id });
        
        // Thêm các quan hệ mới
        for (const categoryId of categoryIds.split(',')) {
          await ProductCategoryModel.create({
            productId: id,
            categoryId: categoryId
          });
        }
      }
  
      // Kiểm tra và cập nhật quan hệ Tag nếu có thay đổi
      if (tagIds && !arraysAreEqual(tagIds, current_tags)) {
        // Xóa các quan hệ cũ với Tag
        await ProductTagModel.deleteMany({ productId: id });
  
        // Thêm các quan hệ mới
        for (const tagId of tagIds.split(',')) {
          await ProductTagModel.create({
            productId: id,
            tagId: tagId,
          });
        }
      }
  
      return res.status(200).json({
        message: 'Product updated successfully',
        product: updatedProduct,
      });
      
      })
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  
  // Cập nhật quan hệ của sản phẩm với Category và Tag
  async updateProduct(req, res) {
    try {
      const { categoryIds, tagIds } = req.body;

      // Cập nhật các quan hệ trong ProductCategory
      await ProductCategoryModel.deleteMany({ productId: req.params.id });
      for (const categoryId of categoryIds) {
        await ProductCategoryModel.create({
          product: req.params.id,
          category: categoryId,
        });
      }

      // Cập nhật các quan hệ trong ProductTag
      await ProductTagModel.deleteMany({ productId: req.params.id });
      for (const tagId of tagIds) {
        await ProductTagModel.create({
          product: req.params.id,
          tag: tagId,
        });
      }

      return res.status(200).json({ message: 'Product relationships updated' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // Xóa sản phẩm và quan hệ của nó với Category và Tag
  async deleteProduct(req, res) {
    try {


      // Xóa quan hệ với Category và Tag
      await ProductCategoryModel.deleteMany({ productId: req.params.id });
      await ProductTagModel.deleteMany({ productId: req.params.id });

      // Xóa sản phẩm
      const product = await ProductModel.findByIdAndDelete(req.params.id);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.status(200).json({
        message: 'Product deleted successfully',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

export {ProductController};
