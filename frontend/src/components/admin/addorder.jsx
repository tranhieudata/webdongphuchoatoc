"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "@/styles/addproduct.css";
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const AddOrder = ({ isOrderOpen, closeOrder, setProducts }) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(null);
  const [tags, setTags] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    sku: "",
    categoryIds: [],
    tagIds: [],
  });
  const [imageFiles, setImageFiles] = useState([]);

  const fetchData = async () => {
    try {
      const res2 = await axios.get(`${API}/api/category/all`);
      const res3 = await axios.get(`${API}/api/tag/all`);
      setCategories(res2.data || []);
      setTags(res3.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories or tags", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isOrderOpen]);

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      categoryIds: checked
        ? [...prevData.categoryIds, value]
        : prevData.categoryIds.filter((id) => id !== value),
    }));
  };

  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      tagIds: checked
        ? [...prevData.tagIds, value]
        : prevData.tagIds.filter((id) => id !== value),
    }));
  };

  const handleImageRemove = (index) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    setImageFiles(Array.from(files));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên sản phẩm");
      return;
    }
    if (!formData.description.trim()) {
      alert("Vui lòng nhập mô tả sản phẩm");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      alert("Vui lòng nhập giá sản phẩm hợp lệ");
      return;
    }
    if (imageFiles.length === 0) {
      alert("Vui lòng tải lên ít nhất một ảnh sản phẩm");
      return;
    }
    if (formData.categoryIds.length === 0) {
      alert("Vui lòng chọn ít nhất một danh mục");
      return;
    }

    setSubmitting(true);
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', formData.name.trim());
    formDataToSubmit.append('description', formData.description.trim());
    formDataToSubmit.append('price', formData.price);
    if (formData.stock) formDataToSubmit.append('stock', formData.stock);
    if (formData.sku) formDataToSubmit.append('sku', formData.sku.trim());
    formDataToSubmit.append('categoryIds', formData.categoryIds.join(','));
    formDataToSubmit.append('tagIds', formData.tagIds.join(','));

    // Append images
    imageFiles.forEach((file) => {
      formDataToSubmit.append('images', file);
    });

    try {
      const response = await axios.post(`${API}/api/product/create`, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Thêm sản phẩm thành công');
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        sku: "",
        categoryIds: [],
        tagIds: [],
      });
      setImageFiles([]);
      closeOrder();
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <>
      {loading ? (
        <div className="loading-container">Đang tải dữ liệu...</div>
      ) : (
        <div className="add-product">
          <div className="detail-product-title">THÊM SẢN PHẨM MỚI</div>
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="product-form">
            {/* Thông tin cơ bản */}
            <fieldset className="form-section">
              <legend>Thông Tin Cơ Bản</legend>
              
              <div className="form-group">
                <label htmlFor="name">Tên Sản Phẩm *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên sản phẩm"
                  className="detail-product-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Mô Tả Sản Phẩm *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả sản phẩm chi tiết"
                  className="detail-product-description"
                  rows="5"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Giá Sản Phẩm (VND) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="detail-product-price"
                    min="0"
                    step="1000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stock">Số Lượng Kho</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="detail-product-input"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sku">SKU</label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="Mã sản phẩm (tuỳ chọn)"
                    className="detail-product-input"
                  />
                </div>
              </div>
            </fieldset>

            {/* Hình ảnh */}
            <fieldset className="form-section">
              <legend>Hình Ảnh Sản Phẩm</legend>
              
              <div className="form-group">
                <label htmlFor="images">Tải Lên Hình Ảnh *</label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    id="images"
                    name="images"
                    accept="image/*"
                    onChange={handleImageChange}
                    multiple
                    className="file-input"
                  />
                  <label htmlFor="images" className="file-input-label">
                    📁 Chọn ảnh ({imageFiles.length} ảnh)
                  </label>
                </div>
              </div>

              {imageFiles.length > 0 && (
                <div className="image-preview-container">
                  <p className="preview-title">Xem trước ({imageFiles.length} ảnh):</p>
                  <div className="images-grid">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="image-preview-item">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="image-thumbnail"
                        />
                        <div className="image-info">
                          <p className="image-name">{file.name}</p>
                          <p className="image-size">({(file.size / 1024).toFixed(1)} KB)</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleImageRemove(index)}
                          className="remove-image-button"
                        >
                          ✕ Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </fieldset>

            {/* Danh mục */}
            <fieldset className="form-section">
              <legend>Danh Mục *</legend>
              <div className="checkbox-group">
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <label key={category._id} className="checkbox-label">
                      <input
                        type="checkbox"
                        value={category._id}
                        checked={formData.categoryIds.includes(category._id)}
                        onChange={handleCategoryChange}
                      />
                      <span>{category.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="no-data">Không có danh mục nào</p>
                )}
              </div>
            </fieldset>

            {/* Tag */}
            <fieldset className="form-section">
              <legend>Thẻ Tag</legend>
              <div className="checkbox-group">
                {tags && tags.length > 0 ? (
                  tags.map((tag) => (
                    <label key={tag._id} className="checkbox-label">
                      <input
                        type="checkbox"
                        value={tag._id}
                        checked={formData.tagIds.includes(tag._id)}
                        onChange={handleTagChange}
                      />
                      <span>{tag.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="no-data">Không có tag nào</p>
                )}
              </div>
            </fieldset>

            {/* Button */}
            <div className="form-actions">
              <button 
                type="submit" 
                className="detail-product-submit"
                disabled={submitting}
              >
                {submitting ? "Đang tải lên..." : "✓ Thêm Sản Phẩm"}
              </button>
              <button 
                type="button" 
                className="detail-product-cancel"
                onClick={closeOrder}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AddOrder;
