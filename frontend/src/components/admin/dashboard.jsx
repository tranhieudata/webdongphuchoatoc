"use client"
import { useState } from 'react';
import BannerManagement from './dashboard/BannerManagement';
import UserManagement from './dashboard/UserManagement';
import BlogManagement from './dashboard/BlogManagement';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('banner');

    return (
        <>
            <div className="admin-right">
                <ToastContainer />
                
                <div className="dashboard-tabs flex border-b mb-4 bg-white p-4">
                    <button 
                        className={`px-6 py-2 mr-2 rounded-t-lg font-medium ${
                            activeTab === 'banner' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => setActiveTab('banner')}
                    >
                        Quản lý Banner
                    </button>
                    <button 
                        className={`px-6 py-2 mr-2 rounded-t-lg font-medium ${
                            activeTab === 'users' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => setActiveTab('users')}
                    >
                        Quản lý Users
                    </button>
                    <button 
                        className={`px-6 py-2 rounded-t-lg font-medium ${
                            activeTab === 'blog' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => setActiveTab('blog')}
                    >
                        Quản lý Bài viết
                    </button>
                </div>

                <div className="dashboard-content bg-gray-50 p-6 min-h-screen">
                    {activeTab === 'banner' && <BannerManagement />}
                    {activeTab === 'users' && <UserManagement />}
                    {activeTab === 'blog' && <BlogManagement />}
                </div>
            </div>
        </>
    );
};

export default Dashboard;