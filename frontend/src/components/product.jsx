"use client"

import Link from "next/link";
import Breadcrumb from "./Breadcrumb";
import React, { useState, useEffect } from 'react';
import axios from "axios";


const ProducPage = (props) => {
    const [data, setData] = useState([]);
    const { productSlug } = props
    const [loading, setLoading] = useState(false);
    
    // Hàm tải sản phẩm từ API
    const loadProducts = async () => {
        if (loading) return;
        setLoading(true);

        // http://localhost:3030/api/product/6763c78cf871ab0c6e04c508
        
        try {
            const res = await axios.get(`http://localhost:3030/api/product/slug/${productSlug}`);
            setData(res.data)
            
            setLoading(false);

        } catch (error) {
            setLoading(false);
            console.error("Error loading this product:", error);
        }
    };

    useEffect(() => {
       
        loadProducts();  // Lấy sản phẩm khi trang đầu tiên được load
    },[productSlug]); // Mỗi lần `id` thay đổi, load lại sản phẩm

  
    
    return (
        <>
        <Breadcrumb />
        
        <div className="product-container">
            {data.product && data.product.length > 0 ? (<>
            
            <div  className=""  >
                {/* QUY ĐỊNH 3 ẢNH  */}
                <div>   </div>
                {/* 1 ẢNH CHÍNH  */}
                <div>   </div>
            </div>
            <div  className=""  >
                {/* TÊN SẢN PHẨM */}
                <div>{data.product.name}</div>
                <div>{data.product.description}</div>
                <div>{data.product.price}</div>
                <div>   </div>
            </div>
            <div  className=""  >
                <div></div>
                <div></div>
            </div>
            
            
            </>) : (
                <div> Không có sản phẩm</div>
            )}
            
        </div>
        
        <div className="">
            {/* CHI TIẾT SẢN PHẨM  */}
            <div>   </div>
            <div>   </div>
        </div>
        </>
    )
};

export default ProducPage;
