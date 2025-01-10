import "../styles/loadmore.css"
const LoadMore = (items) => {
    const numberofpage = items.page
    const numberofproduct = items.numberofproduct
    const fetchProduct = items.fetchProduct
 
  return (
    <>
    {numberofproduct > 0 && <>
        <div className="button-loadmore-box">
            <button className="button-loadmore" onClick={fetchProduct}>Xem thêm {numberofproduct} sản phẩm</button>
        </div>
    </>}
    </>
  )
}
export default LoadMore;