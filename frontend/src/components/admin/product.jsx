"use client";


import { useState,useEffect } from "react";
import axios from "axios";
import PopupProduct from "./popupproduct";
import AddOrder from "./addorder";
const Product = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null)
    const [isOrderOpen, setOrderOpen] = useState(false)



    const LIMIT = 12



    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert("Vui lòng nhập từ khóa tìm kiếm.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setResults([`Sản phẩm 1: ${searchQuery}`, `Sản phẩm 2: ${searchQuery}`]);
      setLoading(false);
    }, 1500);
  };


  const loadProducts = async () => {
      if (loading || !hasMore) return;
      try {
          const res = await axios.get(`http://localhost:3030/api/product/allproduct?page=${page}&limit=${LIMIT}`);
          const newProducts = res.data.products;

          setLoading(false);

          if (newProducts.length < LIMIT) {
              setHasMore(false); // Nếu số sản phẩm ít hơn LIMIT, không còn sản phẩm để tải thêm       
          }
          setProducts(newProducts)
      } catch (error) {
          setLoading(false);
          console.error("Error loading products:", error);
      }
  };

  useEffect(() => {
      loadProducts();  // Lấy sản phẩm khi trang đầu tiên được load
  }, [page]); // Mỗi lần `page` hoặc `slug` thay đổi, load lại sản phẩm

  // Hàm xử lý sự kiện khi người dùng nhấn "Xem thêm"
  const handleNextPage = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    setHasMore(true)
    if (!loading && page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };
  const openModal = (id) => {
    setSelectedProductId(id)
    setIsModalOpen(true); // Mở popup
  };

  const closeModal = () => {
    setIsModalOpen(false); // Đóng popup
  };
  const openOrder = () => {
    setOrderOpen(true)
  }
  const closeOrder = () => {
    setOrderOpen(false)
  }
  // xóa sản phẩm
  const deletProduct = async(id)=>{
    try {
      const res = await axios.delete(`http://localhost:3030/api/product/${id}/delete`);
      setProducts((prevProducts) => prevProducts.filter(product => product._id !== id))
  } catch (error) {
      console.error("Error delete product:", error);
  }
  }
  console.log(products)
  return (
    <>
      <div className="admin-right">
        {/* Hàng chứa nút thêm sản phẩm và ô tìm kiếm */}
        <div className="admin-right-header">
          <button className="admin-right-new-button" onClick={openOrder} >Thêm sản phẩm</button>
            {isOrderOpen && (
              <div className="modal-overlay" >
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                      <div className="close-content" onClick={closeOrder}><div>Đóng</div></div>
                      <div>
                          <AddOrder  isOrderOpen={isOrderOpen} closeOrder={closeOrder} setProducts={setProducts}/>
                      </div>
                  </div>
              </div>
            )}
          <form onSubmit={handleSubmit} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              Tìm kiếm
            </button>
          </form>
        </div>
        {loading && <p>Đang tìm kiếm...</p>}

        <div className="search-results">
          {results.length === 0 && !loading ? (
            <p>Không có kết quả tìm kiếm</p>
          ) : (
            <ul>
              {results.map((result, index) => (
                <li key={index}>{result}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="admin-right-content">
            <div className="content-header">
                <div className="item-header">STT</div>
                <div className="item-header">ID</div>
                <div className="item-header">Tên Sản Phẩm</div>
                <div className="item-header">Option</div>
            </div>
            {products.map((product,index) => (
                <div className="content-box" key={product._id}>
                    <div className="item-header-id">{index + 1}</div>
                    <div className="item-header-id">{product._id}</div>
                    <div className="item-header-content">{product.name}</div>
                    <div className="item-header-option">
                        <div className="item-option-left" onClick={()=>openModal(product._id)}>Edit</div>
                        <div className="item-option-right" onClick={()=>deletProduct(product._id)}>Delete</div>  
                    </div>
                </div>
                    ))}
            <div className="admin-right-pagination">
                <button onClick={handlePrevPage} disabled={loading || page === 1}>
                    Previous
                </button>
                <button onClick={handleNextPage} disabled={loading || !hasMore}>
                    Next
                </button>
            </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlay" >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="close-content" onClick={closeModal}><div>Đóng</div></div>
                <div>
                    <PopupProduct 
                    productId={selectedProductId} 
                    isModalOpen={isModalOpen}
                    closeModal={closeModal}
                    />
                </div>
            </div>
            
        </div>
      )}
    </>
  );
};

export default Product;
