

import News from "@/components/news";
import Wrapper from "@/Layout/wrapper";


export const metadata = {
  title:"Tin Tức - Đồng Phục Hỏa Tốc" ,
  description:"Chào mừng đến với Đồng Phục Hỏa Tốc - Chuyên cung cấp áo đồng phục bếp, đồng phục nhà hàng, công ty, công sở, áo lớp.",
  keywords:"đồng phục bếp, đồng phục nhà hàng, đồng phục công ty, áo lớp, đồng phục công sở",

};

export default async function index({ params }) {
    const { slug } = await params;

  return (
    <Wrapper>
      <News></News>
    </Wrapper>
  );
}
