import Image from "next/image";
import SEO from "@/components/seo";
import Wrapper from "@/Layout/wrapper";
import Home from "@/Layout/Home/home";


export default function index() {
  return (
    <Wrapper>
      <SEO
        title="Trang Chủ - Đồng Phục Hỏa Tốc"
        description="Chào mừng đến với Đồng Phục Hỏa Tốc - Chuyên cung cấp áo đồng phục bếp, đồng phục nhà hàng, công ty, công sở, áo lớp."
        keywords="đồng phục bếp, đồng phục nhà hàng, đồng phục công ty, áo lớp, đồng phục công sở"
        url="https://dongphuchoatoc.com"
      />
      <Home/>
    </Wrapper>
  );
}
