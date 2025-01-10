

import Wrapper from "@/Layout/wrapper";
import TagPage from "@/components/tag"; 
export const metadata = {
  title:"Mẫu Áo - Đồng Phục Hỏa Tốc" ,
  description:"Chào mừng đến với Đồng Phục Hỏa Tốc - Chuyên cung cấp áo đồng phục bếp, đồng phục nhà hàng, công ty, công sở, áo lớp.",
  keywords:"đồng phục bếp, đồng phục nhà hàng, đồng phục công ty, áo lớp, đồng phục công sở",
  image:"https://dongphuchoatoc.com/assets/img/product-image.jpg",
  url:"https://dongphuchoatoc.com/mau-ao"
};

export default async function index({ params }) {
    const { slug } = await params;
  return (
    <Wrapper>
      <img
          src="/assets/img/banner-03.png"  // Đường dẫn đến hình ảnh 
          alt="Description of image"
          style={{height:"100px",width:"100%"}}
      />
      <TagPage tagSlug={slug}/>
    </Wrapper>
  );
}
