"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = ()=>{
const pathname = usePathname()
    return(
        <>
            <div className="admin-left">
                <div className="admin-left-button" >
                    <Link href={`/admin/dashboard`}>Dashboard</Link>
                </div>
                <div className="admin-left-button">
                    <Link href={`/admin/product`} >Product</Link>
                </div>
                <div className="admin-left-button">
                    <Link href={`/admin/news`} >News</Link>
                </div>
                <div className="admin-left-button">
                    <Link href={`/admin/tag`} >Tag</Link>
                </div>
                <div className="admin-left-button">
                    <Link href={`/admin/category`} >Category</Link>
                </div>
                <div className="admin-left-button">
                    <Link href={`/admin/user`} >User</Link>
                </div>
                <div className="admin-left-button">
                    <Link href={`/admin/setting`} >Setting</Link>
                </div>   
            </div>
        
    </>
    )
}

export default Sidebar;