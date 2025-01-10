import React from "react";

const footer_data = [
  {
    id: 1,
    title: "Đồng Phục Hỏa Tốc",
    cls: "col-xl-2",
    footer_col: "footer-col-1",
    links: [
      { name: "Địa Chỉ", link: "/about" },
      { name: "97 Ngõ 99 Định Công Hạ Hoàng Mai Hà Nội", link: "/blog" },

    ],
  },
  {
    id: 2,
    title: "DANH MỤC",
    cls: "col-xl-3",
    footer_col: "footer-col-2",
    links: [
      { name: "Refund Policy", link: "/policy" },
      { name: "Documentation", link: "/documentation" },
      { name: "Chat online", link: "/chat-online" },
      { name: "Order Cancel", link: "/order-cancel" },
      { name: "Privacy Policy", link: "/privacy-policy" },
    ],
  },
  {
    id: 3,
    title: "MẪU MỚI",
    footer_col: "footer-col-3",
    cls: "col-xl-3",
    links: [
      { name: "Contact us", link: "/contact" },
      { name: "Online Chat", link: "/online-chat" },
      { name: "Whatsapp", link: "/whatsapp" },
      { name: "Telegram", link: "/telegram" },
      { name: "Ticketing", link: "/ticketing" },
    ],
  },
];


// social_links
const social_links = [
  {
    link: "http://facebook.com",
    target: "_blank",
    icon: "fab fa-facebook-f",
    name: "Facebook",
  },

];


const Footer = () => {
  return (
    <>
      <footer>
        <div
          className="footer-bg theme-bg bg-bottom footerbackground" style={{background:"#0E7A61",height:"300px"}}
        
        >
          <div className="f-border pt-115 pb-70">
            <div className="container">
              <div className="row">
                {footer_data.map((item) => (
                  <div key={item.id} className={`${item.cls} col-md-4`}>
                    <div className={`footer-widget ${item.footer_col} mb-50`}>
                      <div className="footer-widget__text mb-35">
                        <h3 className="footer-widget__title">{item.title}</h3>
                      </div>
                      <div className="footer-widget__link">
                        <ul>
                          {item.links.map((link, i) => (
                            <li key={i}>
                              <a href="#">{link.name}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="col-xl-4 col-lg-6 col-md-8">
                  <div className="footer-widget footer-col-4  mb-50">
                    <div className="footer-widget__text mb-35">
                      <h3 className="footer-widget__title">MẠNG XÃ HỘI</h3>
                    </div>
                    FACEBOOK
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </footer>
    </>
  );
};

export default Footer;
