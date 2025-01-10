
import Wrapper from "@/Layout/wrapper";
import CategoryPage from "@/components/category";
export const metadata = {
  title:"Danh Mục - Đồng Phục Hỏa Tốc" ,
  description:"Chào mừng đến với Đồng Phục Hỏa Tốc - Chuyên cung cấp áo đồng phục bếp, đồng phục nhà hàng, công ty, công sở, áo lớp.",
  keywords:"đồng phục bếp, đồng phục nhà hàng, đồng phục công ty, áo lớp, đồng phục công sở",
  image:"https://dongphuchoatoc.com/assets/img/product-image.jpg",
  url:"https://dongphuchoatoc.com/products"
};

export default  function index() {
  return (
    <Wrapper>
      <img
          src="/assets/img/banner-03.png"  // Đường dẫn đến hình ảnh 
          alt="Description of image"
          style={{height:"100px",width:"100%"}}
      />
      <CategoryPage categorySlug="all"/>
    </Wrapper>
  );
}
