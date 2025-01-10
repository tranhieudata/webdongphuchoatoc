import "../../styles/admin.css"
import Sidebar from "../../components/admin/sidebar"
import Dashboard from "../../components/admin/dashboard"
const Admin = () =>{
    return(
        <>
           <div className="container-admin">
            <Sidebar/>
            <Dashboard/>
           </div>
            
        </>
    )
}
export default Admin