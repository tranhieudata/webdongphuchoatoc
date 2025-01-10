
import "../../../styles/admin.css"
import "../../../styles/popupproduct.css"
import "../../../styles/pagination.css"
import Sidebar from "../../../components/admin/sidebar"
import Product from "../../../components/admin/product"

export default function index() {
    return (
        <>
            <div className="container-admin">
                <Sidebar/>
                <Product/>
            </div>
         
        </>    
    );
  }
