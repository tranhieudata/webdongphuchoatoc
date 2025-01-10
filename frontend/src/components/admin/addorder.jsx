"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const AddOrder = ({ isOrderOpen, closeOrder, setProducts }) => {
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [categories, setCategories] = useState(null);
  const [tags, setTags] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryIds: [], // Lưu danh mục đã chọn
    tagIds: [], // Lưu tag đã chọn
  });
  const [imageFiles, setImageFiles] = useState([]); // Trường này sẽ lưu mảng các tệp ảnh được chọn

  const fetchData = async () => {
    try {
      const res2 = await axios.get(`http://localhost:3030/api/category/all`);
      const res3 = await axios.get(`http://localhost:3030/api/tag/all`);
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
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index)); // Xóa ảnh theo index
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
    setFormData((prevData) => ({
      ...prevData,
      images: files,
    }));
    setImageFiles(Array.from(files))
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('description', formData.description);
    formDataToSubmit.append('price', formData.price);
    formDataToSubmit.append('categoryIds', formData.categoryIds.join(','));
    formDataToSubmit.append('tagIds', formData.tagIds.join(','));
    if (!formData.images || formData.images.length === 0) {
      alert("Vui lòng tải lên ít nhất một ảnh sản phẩm.");
      return;
    }
    // Append images
    for (let i = 0; i < formData.images.length; i++) {
      formDataToSubmit.append('images', formData.images[i]);
    }

    try {
        const response = await axios.post('http://localhost:3030/api/product/create', formDataToSubmit, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Thêm sản phẩm thành công');
        closeOrder()
      } catch (error) {
        alert('Có lỗi xảy ra');
      }

    };
  
  return (
    <>
      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : (
        <div className="add-product">
          <div className="detail-product-title">THÊM SẢN PHẨM MỚI</div>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên sản phẩm"
                className="detail-product-input"
              />
            </div>
            <div>
              <textarea
                id="description"
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
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Nhập giá sản phẩm"
                className="detail-product-price"
              />
            </div>
            <div>
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                onChange={handleImageChange}
                multiple // Cho phép chọn nhiều tệp
                className="detail-product-input"
              />
            </div>

            {/* Hiển thị các ảnh đã chọn */}
            <div>
              {imageFiles.length > 0 && (
                <div className="image-preview-container">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="image-preview">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Image ${index + 1}`}
                        className="image-thumbnail" style={{width:"100px"}}
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="remove-image-button"
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Danh mục */}
            <div>
              <label className="popup-category">Danh Mục:</label>
              <div>
                {categories &&
                  categories.map((category) => (
                    <div key={category._id}>
                      <label>
                        <input
                          type="checkbox"
                          name="categoryIds"
                          value={category._id}
                          onChange={handleCategoryChange}
                        />
                        {category.name}
                      </label>
                    </div>
                  ))}
              </div>
            </div>

            {/* Tag */}
            <div>
              <label className="popup-tag">Thẻ Tag:</label>
              <div>
                {tags &&
                  tags.map((tag) => (
                    <div key={tag._id}>
                      <label>
                        <input
                          type="checkbox"
                          name="tagIds"
                          value={tag._id}
                          onChange={handleTagChange}
                        />
                        {tag.name}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
            <button type="submit" className="detail-product-submit">
              Thêm Sản Phẩm
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AddOrder;
