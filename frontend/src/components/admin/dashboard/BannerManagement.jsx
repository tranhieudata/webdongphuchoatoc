import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: '',
    image: null,
    link: '',
    status: 'active'
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get('/api/banners');
      setBanners(response.data);
    } catch (error) {
      toast.error('Lỗi khi tải banner');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setNewBanner({ ...newBanner, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', newBanner.title);
    formData.append('image', newBanner.image);
    formData.append('link', newBanner.link);
    formData.append('status', newBanner.status);

    try {
      await axios.post('/api/banners', formData);
      toast.success('Thêm banner thành công');
      fetchBanners();
      setNewBanner({ title: '', image: null, link: '', status: 'active' });
    } catch (error) {
      toast.error('Lỗi khi thêm banner');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa banner này?')) return;
    
    try {
      await axios.delete(`/api/banners/${id}`);
      toast.success('Xóa banner thành công');
      fetchBanners();
    } catch (error) {
      toast.error('Lỗi khi xóa banner');
    }
  };

  return (
    <div className="banner-management p-4">
      <h2 className="text-2xl font-bold mb-4">Quản lý Banner</h2>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid gap-4">
          <div>
            <label className="block mb-2">Tiêu đề banner</label>
            <input 
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Nhập tiêu đề banner"
              value={newBanner.title}
              onChange={(e) => setNewBanner({...newBanner, title: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block mb-2">Hình ảnh</label>
            <input 
              type="file"
              className="w-full p-2 border rounded"
              accept="image/*"
              onChange={handleImageUpload}
              required
            />
          </div>

          <div>
            <label className="block mb-2">Link liên kết</label>
            <input 
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Nhập link liên kết"
              value={newBanner.link}
              onChange={(e) => setNewBanner({...newBanner, link: e.target.value})}
            />
          </div>

          <div>
            <label className="block mb-2">Trạng thái</label>
            <select
              className="w-full p-2 border rounded"
              value={newBanner.status}
              onChange={(e) => setNewBanner({...newBanner, status: e.target.value})}
            >
              <option value="active">Hiển thị</option>
              <option value="inactive">Ẩn</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Thêm Banner'}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map(banner => (
          <div key={banner._id} className="border rounded p-4">
            <img 
              src={banner.imageUrl} 
              alt={banner.title} 
              className="w-full h-48 object-cover mb-2"
            />
            <h3 className="font-bold">{banner.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{banner.link}</p>
            <p className="text-sm mb-2">
              Trạng thái: {banner.status === 'active' ? 'Hiển thị' : 'Ẩn'}
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => handleDelete(banner._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerManagement;
