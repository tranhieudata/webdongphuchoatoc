
import Wrapper from "@/Layout/wrapper";
import About from "@/components/about";
import Breadcrumb from "@/components/breadcrumb";
export const metadata = {
  title:"Giới Thiệu - Đồng Phục Hỏa Tốc" ,
  description:"Chào mừng đến với Đồng Phục Hỏa Tốc - Chuyên cung cấp áo đồng phục bếp, đồng phục nhà hàng, công ty, công sở, áo lớp.",
  keywords:"đồng phục bếp, đồng phục nhà hàng, đồng phục công ty, áo lớp, đồng phục công sở",
  image:"https://dongphuchoatoc.com/assets/img/product-image.jpg",
  url:"https://dongphuchoatoc.com/products"
};

export default function index() {
  return (
    <Wrapper>
      <Breadcrumb subtitle="Giới Thiệu" linksub="/gioi-thieu"   />
      <About/>
    </Wrapper>
  );
}
