import Link from "next/link";
import React from "react";

const Breadcrumb = ({ subtitle,linksub, subtitle2,linksub2, subtitle3 }) => {
  return (
    <>
      <nav aria-label="breadcrumb fix-breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item breadcrumb-item-fix"><a href="/">Trang Chủ</a></li>
          <li className="breadcrumb-item breadcrumb-item-fix"><a href={linksub}>{subtitle}</a></li>
          {subtitle2 && <li className="breadcrumb-item active breadcrumb-item-fix" ><a href={linksub2}>{subtitle2}</a></li>}
          {subtitle3 && <li className="breadcrumb-item active breadcrumb-item-fix" aria-current="page">{subtitle3}</li> }
          
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumb;
