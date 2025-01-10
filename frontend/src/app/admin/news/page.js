
import "../../../styles/admin.css"
import "../../../styles/popupproduct.css"
import "../../../styles/pagination.css"
import Sidebar from "../../../components/admin/sidebar"
import News from "@/components/admin/news"


export default function index() {
    return (
        <>
            <div className="container-admin">
                <Sidebar/>
                <News/>
            </div>
         
        </>    
    );
  }
