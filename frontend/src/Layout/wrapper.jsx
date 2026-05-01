"use client"

import React, {useEffect,useState} from "react";
// import BackToTop from "../lib/BackToTop";
import Footer from "./Footers/footer";
import Navbar from "./Headers/navbar";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL ;

const Wrapper = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      
    }, 500);
    // Fetch categories
    const fetchCategories = async () => {
      const res = await axios(`${API}/api/category/all`);
      

      setCategories(res.data);
    };
    
    // Fetch tags
    const fetchTags = async () => {
      const res = await axios(`${API}/api/tag/all`);

      setTags(res.data);
    };

    fetchCategories();
    fetchTags();
  },[])

  return (
    <>
      <Navbar categories={categories} tags={tags} />
      {children}
      <Footer />
      {/* <BackToTop /> */}
    </>
  );
};

export default Wrapper;
