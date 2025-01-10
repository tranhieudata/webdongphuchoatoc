module.exports = {
    siteUrl: 'https://dongphuchoatoc.com',  // URL của trang web của bạn
    generateRobotsTxt: true, // Tạo robots.txt tự động
    sitemapSize: 15000, // Số lượng URL tối đa trong sitemap
    robotsTxtOptions: {
      additionalSitemaps: [
        'https://dongphuchoatoc.com/sitemap.xml', // Đường dẫn sitemap của bạn
      ],
    },
  };