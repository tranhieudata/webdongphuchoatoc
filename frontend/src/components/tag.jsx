"use client"

import "../styles/collection.css"
import Link from "next/link";
import Breadcrumb from "./Breadcrumb";
import LoadMore from "./loadmore";
import React, { useState, useEffect } from 'react';
import axios from "axios";

const LIMIT = 12;

const TagPage = (props) => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [remainingProducts, setRemainingProducts] = useState(0);
    const [tags, setTags] = useState([]);
    

    const  slug = props.tagSlug

    // Hàm tải sản phẩm từ API
    const loadProducts = async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        // Nếu có slug (người dùng đang xem danh mục cụ thể)
        const apiUrl = slug 
            ? `http://localhost:3030/api/product/tag/${slug}/allproduct?page=${page}&limit=${LIMIT}`
            : `http://localhost:3030/api/product/allproduct?page=${page}&limit=${LIMIT}`; // Lấy tất cả sản phẩm khi không có slug
        
        try {
            const res = await axios.get(apiUrl);
            const newProducts = res.data.products;

            setRemainingProducts(res.data.remainingProducts);
            setLoading(false);

            if (newProducts.length < LIMIT) {
                setHasMore(false); // Nếu số sản phẩm ít hơn LIMIT, không còn sản phẩm để tải thêm
            }

            // Thêm sản phẩm mới vào danh sách sản phẩm hiện tại
            setProducts((prevProducts) => [
                ...prevProducts,
                ...newProducts.filter(
                    newProduct => !prevProducts.some(product => product._id === newProduct._id)
                )
            ]);
        } catch (error) {
            setLoading(false);
            // console.error("Error loading products:", error);
        }
    };

    // Hàm tải danh mục
    const fetchTags = async () => {
        try {
            const res = await axios.get('http://localhost:3030/api/tag/all');
            setTags(res.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchTags(); // Lấy danh mục
        loadProducts();  // Lấy sản phẩm khi trang đầu tiên được load
    }, [page, slug]); // Mỗi lần `page` hoặc `slug` thay đổi, load lại sản phẩm

    // Hàm xử lý sự kiện khi người dùng nhấn "Xem thêm"
    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1); // Tăng trang để tải thêm sản phẩm
        }
    };

    return (
        <>
        <div className="collection-page">
            <div className="left-column">
                <div className="left-column-title">MẪU ÁO ĐỒNG PHỤC</div>
                <ul>
                    {tags && tags.length > 0 ? (
                        tags.map((tag) => (
                            <li key={tag._id} className="arrow-categorie">
                                <Link href={`/mau-ao/${tag.slug}`}>{tag.name}</Link>
                            </li>
                        ))
                    ) : (
                        <li>Không có danh mục nào</li>
                    )}
                </ul>

                <div className="cotact-box">
                    <div className="left-column-title">HỖ TRỢ TRỰC TIẾP</div>
                    <div className="cotact-box-container">
                        <img src="/assets/img/telesale-man.jpg" alt="Mr. Hiếu" className="cotact-box-img" />
                        <div>
                            <div style={{color:"black",fontWeight:"bold"}}>Mr.Hiếu</div>
                            <div style={{color:"red",fontWeight:"bold"}}>0969.468.988</div>
                            <p>dongphuchoatoc@gmail.com</p>
                        </div>
                    </div>
                    <div className="cotact-box-container">
                        <img src="/assets/img/telesale-woman.jpg" alt="Mrs. Hà" className="cotact-box-img" />
                        <div>
                            <div style={{color:"black",fontWeight:"bold"}}>Mrs.Hà</div>
                            <div style={{color:"red",fontWeight:"bold"}}>038.2468.988</div>
                            <p>dongphuchoatoc@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="right-column">
                <Breadcrumb subtitle="Danh Mục Sản Phẩm" linksub="/danh-muc" subtitle2="" linksub2="" subtitle3="" />
                <div className="category-content">
                    Đồng Phục Hỏa Tốc cung cấp các lựa chọn áo đồng phục hỏa tốc với chất liệu vải bền đẹp, giúp bạn tiết kiệm thời gian nhưng vẫn đảm bảo chất lượng. <br />
                    Chúng tôi nhận may đồng phục cho các công ty, trường học, nhóm, sự kiện với thời gian giao hàng nhanh chóng, phục vụ mọi nhu cầu từ đồng phục công sở đến các sự kiện đặc biệt. <br />
                    Đặc biệt, với dịch vụ đồng phục hỏa tốc, bạn sẽ nhận được sản phẩm trong thời gian ngắn, đảm bảo sự đồng bộ và phong cách cho tập thể. <br />
                    Hãy đến với chúng tôi để có được những chiếc áo đồng phục đẹp, phù hợp với mọi mục đích sử dụng!
                </div>

                <div className="product-grid">
                    {products.map((product) => (
                        <div className="product-item" key={product._id}>
                            {/* Hiển thị ảnh sản phẩm */}
                            <img src={`http://localhost:3030/${product.images[0]}`} alt={product.name} />
                            <Link href={`/san-pham/${product.slug}`}>{product.name}</Link>
                        </div>
                    ))}
                </div>

                <LoadMore 
                    page={page} 
                    numberofproduct={remainingProducts} 
                    fetchProduct={handleLoadMore} 
                />
            </div>
        </div>
        </>
    );
};

export default TagPage;
