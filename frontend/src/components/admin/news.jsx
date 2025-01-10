"use client";

import { useState,useEffect } from "react";
import axios from "axios";
import PopupProduct from "./popupproduct";
import AddNews from "./addnews";
const News = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null)
    const [isNewsOpen, setNewsOpen] = useState(false)

    const openNews = ()=>{
        setNewsOpen(true)
    } 
    const closeNews = ()=>{
        setNewsOpen(false)
    }
  return (
    <>
      <div className="admin-right">
        {/* Hàng chứa nút thêm sản phẩm và ô tìm kiếm */}
        <div className="admin-right-header">
          <button className="admin-right-new-button" onClick={openNews} >Thêm bài viết</button>
            {isNewsOpen && (
              <div className="modal-overlay" >
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                      <div className="close-content" onClick={closeNews}><div>Đóng</div></div>
                      <div>
                          <AddNews />
                      </div>
                  </div>
              </div>
            )}
          <form  className="search-form">
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
                <div className="item-header">Tên bài vi</div>
                <div className="item-header">Option</div>
            </div>
            {/* {products.map((product,index) => (
                <div className="content-box" key={product._id}>
                    <div className="item-header-id">{index + 1}</div>
                    <div className="item-header-id">{product._id}</div>
                    <div className="item-header-content">{product.name}</div>
                    <div className="item-header-option">
                        <div className="item-option-left" onClick={()=>openModal(product._id)}>Edit</div>
                        <div className="item-option-right" onClick={()=>deletProduct(product._id)}>Delete</div>  
                        
                    </div>
                </div>
                    ))} */}
            {/* <div className="admin-right-pagination">
                <button onClick={handlePrevPage} disabled={loading || page === 1}>
                    Previous
                </button>
                <button onClick={handleNextPage} disabled={loading || !hasMore}>
                    Next
                </button>
            </div> */}
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

export default News;
