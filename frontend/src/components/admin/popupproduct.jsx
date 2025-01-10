"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

const PopupProduct = ({ productId, isModalOpen, closeModal }) => {
  const [data, setData] = useState(null); // Dữ liệu sản phẩm
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [categories, setCategories] = useState(null);
  const [tags, setTags] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryIds: [],
    tagIds: [],
    images: [], // Lưu trữ ảnh mới được chọn
    removedImages: [], // Mảng lưu trữ ảnh bị xóa
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productRes, categoriesRes, tagsRes] = await Promise.all([
        axios.get(`http://localhost:3030/api/product/id/${productId}`),
        axios.get(`http://localhost:3030/api/category/all`),
        axios.get(`http://localhost:3030/api/tag/all`),
      ]);

      setData(productRes.data);
      setCategories(categoriesRes.data);
      setTags(tagsRes.data);

      setFormData({
        name: productRes.data.product.name,
        description: productRes.data.product.description,
        price: productRes.data.product.price,
        categoryIds: productRes.data.categories.map(category => category.categoryId._id),
        tagIds: productRes.data.tags.map(tag => tag.tagId._id),
        images: productRes.data.product.images || [], // Nếu có ảnh cũ, lấy ra
        removedImages: [],
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("Lỗi khi lấy dữ liệu sản phẩm");
      console.error("Lỗi khi lấy dữ liệu", error);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchData(); // Gọi API khi có `productId`
    }
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      categoryIds: checked
        ? [...prevData.categoryIds, value]
        : prevData.categoryIds.filter(id => id !== value),
    }));
  };

  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      tagIds: checked
        ? [...prevData.tagIds, value]
        : prevData.tagIds.filter(id => id !== value),
    }));
  };

  // Xử lý thay đổi ảnh
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prevData => ({
      ...prevData,
      images: [...prevData.images, ...files], // Thêm ảnh mới vào mảng ảnh
    }));
  };

  // Xóa ảnh đã chọn
  const handleRemoveImage = (index) => {
    const removedImage = formData.images[index];
    
    // Đảm bảo rằng removedImages luôn là mảng
    setFormData(prevData => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index), // Xóa ảnh theo chỉ mục
      removedImages: Array.isArray(prevData.removedImages) // Kiểm tra nếu removedImages đã là mảng
        ? [...prevData.removedImages, removedImage] // Thêm ảnh đã xóa vào removedImages
        : [removedImage], // Nếu không phải mảng, khởi tạo là mảng chứa ảnh
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.removedImages.length === formData.images.length && formData.images.length === 0) {
      alert("Vui lòng tải lên ít nhất một ảnh sản phẩm mới.");
      return;
    }
    try {
      const formDataToSubmit = new FormData();

      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('description', formData.description);
      formDataToSubmit.append('price', formData.price);
      formDataToSubmit.append('categoryIds', formData.categoryIds.join(','));
      formDataToSubmit.append('tagIds', formData.tagIds.join(','));

      // Thêm các ảnh vào FormData
      formData.images.forEach((image) => {
        formDataToSubmit.append('images', image);
      });
      if (formData.removedImages.length > 0) {
        formDataToSubmit.append('removedImages', JSON.stringify(formData.removedImages));
      }

      const res = await axios.put(
        `http://localhost:3030/api/product/${productId}/edit`,
        formDataToSubmit,
        { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
      );

      alert("Sản phẩm đã được cập nhật thành công!");
      closeModal();
    } catch (error) {
      alert("Lỗi khi cập nhật sản phẩm");
      console.error("Lỗi khi cập nhật sản phẩm:", error);
    }
  };

  if (!isModalOpen) return null; // Nếu modal không mở, không hiển thị gì

  return (
    <div className="popup-detail-product">
      {loading ? (
        <div>Đang tải dữ liệu...</div> // Hiển thị loading khi dữ liệu đang được tải
      ) : (
        <div>
          <div className="detail-product-title">Chỉnh sửa sản phẩm: {data?.product?.name}</div>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên sản phẩm"
                className="detail-product-input"
              />
            </div>
            <div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Nhập mô tả sản phẩm"
                className="detail-product-description"
              />
            </div>
            <div>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Nhập giá sản phẩm"
                className="detail-product-price"
              />
            </div>

            {/* Chỉnh sửa ảnh */}
            <div>
              <label>Ảnh sản phẩm:</label>
              
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              
              <div className="image-preview-container">
                {formData.images.map((image, index) => (
                  <div key={index} className="image-preview">
                    
                    {image instanceof File ? (
                      
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Ảnh ${index + 1}`}
                        className="image-thumbnail" style={{width:"100px"}}
                      />
                    ) : (
                      <img
                        src={`http://localhost:3030/${image}`}
                        alt={`Ảnh ${index + 1}`}
                        className="image-thumbnail" style={{width:"100px"}}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="remove-image-button"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Danh mục */}
            <div>
              <label className="popup-category">Danh Mục:</label>
              <div>
                {categories && categories.map((category) => (
                  <div key={category._id}>
                    <label>
                      <input
                        type="checkbox"
                        value={category._id}
                        checked={formData.categoryIds.includes(category._id)}
                        onChange={handleCategoryChange}
                      />
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Thẻ tag */}
            <div>
              <label className="popup-tag">Thẻ Tag:</label>
              <div>
                {tags && tags.map((tag) => (
                  <div key={tag._id}>
                    <label>
                      <input
                        type="checkbox"
                        value={tag._id}
                        checked={formData.tagIds.includes(tag._id)}
                        onChange={handleTagChange}
                      />
                      {tag.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="detail-product-submit">
              Lưu thay đổi
            </button>
          </form>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default PopupProduct;
