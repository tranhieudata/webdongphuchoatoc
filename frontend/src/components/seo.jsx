import Head from "next/head";

const SEO = ({ title, description, keywords, imageUrl, url }) => {
  const defaultTitle = "Đồng Phục Hoạt Tốc | Áo Đồng Phục Bếp, Nhà Hàng, Công Ty";
  const defaultDescription = "Chuyên cung cấp đồng phục bếp, đồng phục nhà hàng, đồng phục công ty, công sở và đồng phục áo lớp chất lượng cao tại Đồng Phục Hoạt Tốc.";
  const defaultKeywords = "đồng phục bếp, đồng phục nhà hàng, đồng phục công ty, áo lớp, đồng phục công sở, đồng phục chất lượng";
  const defaultImage = "/assets/img/logo.png"; // Hình ảnh mặc định
  const defaultUrl = "https://dongphuchoatoc.com";

  return (
    <Head>
      {/* Title */}
      <title>{title || defaultTitle}</title>

      {/* Description */}
      <meta name="description" content={description || defaultDescription} />
      
      {/* Keywords */}
      <meta name="keywords" content={keywords || defaultKeywords} />
      
      {/* Open Graph (Social Media) */}
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={imageUrl || defaultImage} />
      <meta property="og:url" content={url || defaultUrl} />
      <meta property="og:type" content="website" />

    

      {/* Robots Meta Tag */}
      <meta name="robots" content="index, follow" />
      
      {/* Structured Data (JSON-LD) for Product or Business */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Đồng Phục Hoạt Tốc",
            "url": "https://dongphuchoatoc.com",
            "logo": "",
            "sameAs": [
              "https://www.facebook.com/dongphuchoatoc1",
              
            ]
          })
        }}
      />
    </Head>
  );
};

export default SEO;
