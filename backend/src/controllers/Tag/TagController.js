import mongoose from "mongoose";
import { TagModel } from "../../models/tag.js";
class TagController {
    // Tạo mới thẻ sản phẩm
    async create(req,res) {
        try {
            if(!req.body){
                return res.status(500).json({ message: 'Không có thông tin của Tag' });
            }
            
            const newTag = new TagModel(req.body);
            await newTag.save();
    
            return res.status(201).json({
                message: 'Tag created successfully',
                tag: newTag
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
    // Lấy tất cả thẻ sản phẩm
    async getAll(req, res) {
        try {
            const tags = await TagModel.find({});  // Lấy tất cả danh mục
            return res.status(200).json(tags);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
    // Lấy danh mục sản phẩm theo Id
    async getTagById(req, res) {
        try {
            const tagId = req.params.id;
            const tag = await TagModel.findById(tagId);
            if (!tag) {
                return res.status(404).json({ message: 'Tag not found' });
            }
            return res.status(200).json(tag);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
    //Cập nhật Danh mục sản phẩm
    async updateTag(req, res) {
        try {
            const tag = await TagModel.findById(req.params.id)
            if(tag){
                const updatedTag = await TagModel.findByIdAndUpdate(req.params.id,req.body);
                return res.status(200).json({
                    message: 'Tag updated successfully',
                    tag: updatedTag
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
    //Xóa Danh mục sản phẩm 
    async deleteTag(req,res) {
        try {
            const tagId = req.params.id;
            const deletedTag = await TagModel.findByIdAndDelete(tagId);
            if (!deletedTag) {
                return res.status(404).json({ message: 'Tag not found' });
            }
            return res.status(200).json({
                message: 'Tag deleted successfully',
                tag: deletedTag
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
}
export {TagController}