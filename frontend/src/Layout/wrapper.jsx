"use client"

import React, {useEffect,useState} from "react";
// import BackToTop from "../lib/BackToTop";
import Footer from "./footers/footer";
import Navbar from "./Headers/navbar";
import axios from "axios";
const Wrapper = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      
    }, 500);
    // Fetch categories
    const fetchCategories = async () => {
      const res = await axios('http://localhost:3030/api/category/all');
      

      setCategories(res.data);
    };
    
    // Fetch tags
    const fetchTags = async () => {
      const res = await axios('http://localhost:3030/api/tag/all');

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
