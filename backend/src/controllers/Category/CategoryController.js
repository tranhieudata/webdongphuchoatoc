import mongoose from "mongoose";
import { CategoryModel } from "../../models/category.js";

class CategoryController {
    // Tạo mới Danh mục sản phẩm
    async create(req, res) {
        try {
          const { name } = req.body;
    
          if (!name) {
            return res.status(400).json({ message: 'Tên danh mục là bắt buộc' });
          }
    
          // Tạo một đối tượng Category mới và lưu vào cơ sở dữ liệu
          const newCategory = new CategoryModel({
            name
          });
            // Kiểm tra xem slug có được gán đúng không trước khi lưu
            console.log('Slug before saving:', newCategory.slug);
          // Lưu danh mục mới vào cơ sở dữ liệu
          await newCategory.save();
          console.log('Slug after saving:', newCategory.slug);
    
          return res.status(201).json({
            message: 'Category created successfully',
            category: newCategory
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Server error' });
        }
      }
    // Lấy tất cả danh mục sản phẩm
    async getAll(req, res) {
        try {
            const categories = await CategoryModel.find({});  // Lấy tất cả danh mục
            return res.status(200).json(categories);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
    // Lấy danh mục sản phẩm theo Id
    async getCategoryById(req, res) {
        try {
            const categoryId = req.params.id;
            const category = await CategoryModel.findById(categoryId);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            return res.status(200).json(category);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
    //Cập nhật Danh mục sản phẩm
    async updateCategory(req, res) {
        try {
            const cate = await CategoryModel.findById(req.params.id)
            if(cate){
                const updatedCategory = await CategoryModel.findByIdAndUpdate(req.params.id,req.body);
                return res.status(200).json({
                    message: 'Category updated successfully',
                    category: updatedCategory
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
    //Xóa Danh mục sản phẩm 
    async deleteCategory(req,res) {
        try {
            const categoryId = req.params.id;
            const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);
            if (!deletedCategory) {
                return res.status(404).json({ message: 'Category not found' });
            }
            return res.status(200).json({
                message: 'Category deleted successfully',
                category: deletedCategory
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
}

export {CategoryController}

