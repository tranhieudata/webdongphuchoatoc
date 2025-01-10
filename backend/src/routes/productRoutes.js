// routes/productRoutes.js
import express from 'express';
import { ProductController } from '../controllers/Product/ProductController.js';

const ProductRoute = express.Router();
const productController = new ProductController()

ProductRoute.post('/create', productController.createProduct); // Tạo sản phẩm và quan hệ với Category, Tag

ProductRoute.get('/category/:slug/allproduct', productController.getProductsByCategory);// Lấy sản phẩm theo ID
ProductRoute.get('/tag/:slug/allproduct', productController.getProductsByTag);// Lấy sản phẩm theo ID
ProductRoute.get('/allproduct',productController.getAllProductsByPage) // GET /allproducts?page=2&limit=10
ProductRoute.get('/id/:id', productController.getProductById);// Lấy sản phẩm theo ID
ProductRoute.get('/slug/:slug', productController.getProductBySlug);// Lấy sản phẩm theo slug
ProductRoute.put('/:id/edit', productController.updateProductById);// Cập nhật quan hệ của sản phẩm với id
ProductRoute.put('/:id/catetag/edit', productController.updateProduct);// Cập nhật quan hệ của sản phẩm với Category, Tag

ProductRoute.delete('/:id/delete', productController.deleteProduct);// Xóa sản phẩm và các quan hệ của nó

export {ProductRoute};
