// components/Navbar.js
import Link from 'next/link';
import "../../styles/navbar.css";
import React, {useEffect, useState} from 'react';
import axios from 'axios';
const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [categories, setCategories] = useState(null)
    const [tags, setTags] = useState(null)

    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };
    useEffect(()=>{
        const fetchCategories = async () => {
            try {
              const res = await axios.get('http://localhost:3030/api/category/all'); // Gọi API bằng axios
              setCategories(res.data); // Lưu dữ liệu trả về vào state
            } catch (error) {
              console.error('Error fetching categories:', error);
            }
          };
        const fetchTags = async () => {
        try {
            const res = await axios.get('http://localhost:3030/api/tag/all'); // Gọi API bằng axios
            setTags(res.data); // Lưu dữ liệu trả về vào state
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
        };
        fetchCategories();
        fetchTags()

    },[])
 
  return (
    <>
    <div className='overnavbar'>
        <div className='overnavbar-item'>
            Hotline HN: 0969.468.988 – HCM: 0335003416 | CHÚNG TÔI MANG CHẤT LƯỢNG ĐẾN BẠN, NHANH CHÓNG VÀ HOÀN HẢO | Làm việc: T2 – CN , 24/7
        </div>
        <div className='overnavbar-item'><Link href="/login" className='overnavbar-login'>Tài Khoản</Link></div>

    </div>
    <nav className="navbar navbar-expand-lg navbar-light shadow-sm navbar-custom">
      <div className="container-fluid">
        {/* Logo */}
        <Link href="/" className="navbar-brand">
          <img src="/assets/img/logo.png" alt="Logo" height="40" />
        </Link>

        {/* Toggler cho thiết bị di động */}
        {/* <button className="navbar-toggler mobilenav-toggle" type="button" onClick={toggleMenu} aria-label="Toggle navigation"> */}
        <button className="mobilenav-toggle" onClick={toggleMenu}>
          <span className="navbar-toggler-icon"></span> 
        </button>
            <ul className={`mobilenav ${menuOpen ? 'open' : ''}`}>
                <li><Link href="/gioi-thieu" className="dropdown-item">Giới Thiệu</Link></li>
                <li><Link href="/danh-muc" className="dropdown-item">Bộ Sưu Tập</Link></li>
                <li><Link href="/mau-ao" className="dropdown-item">Mẫu Áo</Link></li>
                <li><Link href="/mau-vai" className="dropdown-item">Mẫu Vải</Link></li>
                <li><Link href="/bang-size" className="dropdown-item">Bảng Size</Link></li>
                <li><Link href="/feedback" className="dropdown-item">Feedback</Link></li>
                <li><Link href="/tin-tuc" className="dropdown-item">Tin Tức</Link></li>
                <li className="nav-item">
                    <form className="d-flex" role="search">
                        <input className="form-control me-2" type="search" placeholder="Tìm kiếm" aria-label="Search" />
                        <button className="btn btn-outline-dark" type="submit">Tìm</button>
                    </form>
                </li>
            </ul>
        {/* Nội dung navbar */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto"> {/* ms-auto: căn lề phải */}
            <li className="nav-item">
              <Link href="/gioi-thieu" className="nav-link">GIỚI THIỆU</Link>
            </li>
            {/* Dropdown Bộ Sưu Tập */}
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle dropbtn" href={`/danh-muc`} id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                BỘ SƯU TẬP
              </Link>
              <ul className="dropdown-content" aria-labelledby="navbarDropdown">
              {/* Kiểm tra nếu categories có dữ liệu */}
              {categories && categories.length > 0 ? (
                categories.map((categorie) => (
                    <li key={categorie._id}>
                        <Link href={`/danh-muc/${categorie.slug}`} className="dropdown-item">
                            {categorie.name}
                        </Link>
                    </li>
                    ))
                ) : (
                    <li>Không có danh mục nào</li>
                )}
                    
              </ul>
            </li>
            {/* Dropdown Mẫu Áo */}
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle dropbtn" href={`/mau-ao`} id="navbarDropdownTags" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                MẪU ÁO
              </Link>
              <ul className="dropdown-content" aria-labelledby="navbarDropdownTags">
                {/* Kiểm tra nếu categories có dữ liệu */}
              {tags && tags.length > 0 ? (
                tags.map((tag) => (
                    <li key={tag._id}>
                        <Link href={`/mau-ao/${tag.slug}`} className="dropdown-item">
                            {tag.name}
                        </Link>
                    </li>
                    ))
                ) : (
                    <li>Không có danh mục nào</li>
                )}
              </ul>
            </li>
            <li className="nav-item">
              <Link href="/mau-vai" className="nav-link">MẪU VẢI</Link>
            </li>
            <li className="nav-item">
              <Link href="/bang-size" className="nav-link">BẢNG SIZE</Link>
            </li>
            <li className="nav-item">
              <Link href="/feedback" className="nav-link">FEEDBACK</Link>
            </li>
            <li className="nav-item">
              <Link href="/tin-tuc" className="nav-link">TIN TỨC</Link>
            </li>
            <li className="nav-item">
              <form className="d-flex" role="search">
                <input className="form-control me-2" type="search" placeholder="Tìm kiếm" aria-label="Search" />
                <button className="btn btn-outline-dark" type="submit">Tìm</button>
              </form>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navbar;
