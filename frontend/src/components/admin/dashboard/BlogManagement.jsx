"use client"
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { toast } from 'react-toastify';

// Import React Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <div className="h-52 border rounded bg-gray-50">Loading editor...</div>,
});
import 'react-quill/dist/quill.snow.css';

const BlogManagement = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newPost, setNewPost] = useState({
        title: '',
        slug: '',
        metaDescription: '',
        content: '',
        featuredImage: null,
        status: 'draft',
        tags: []
    });

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ],
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('/api/news');
            setPosts(response.data.posts || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast.error('Lỗi khi tải danh sách bài viết');
        }
    };

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setNewPost({
            ...newPost,
            title,
            slug: generateSlug(title)
        });
    };

    const handleTagsChange = (e) => {
        const tags = e.target.value.split(',').map(tag => tag.trim());
        setNewPost({ ...newPost, tags });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setNewPost({ ...newPost, featuredImage: file });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', newPost.title);
            formData.append('content', newPost.content);
            formData.append('metaDescription', newPost.metaDescription);
            formData.append('status', newPost.status);
            formData.append('tags', JSON.stringify(newPost.tags));
            
            if (newPost.featuredImage) {
                formData.append('featuredImage', newPost.featuredImage);
            }

            await axios.post('/api/news', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Thêm bài viết thành công');
            fetchPosts();
            setNewPost({
                title: '',
                slug: '',
                metaDescription: '',
                content: '',
                featuredImage: null,
                status: 'draft',
                tags: []
            });
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi thêm bài viết');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm('Bạn có chắc muốn xóa bài viết này?')) return;

        try {
            await axios.delete(`/api/news/${postId}`);
            toast.success('Xóa bài viết thành công');
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error('Lỗi khi xóa bài viết');
        }
    };

    return (
        <div className="blog-management p-4">
            <h2 className="text-2xl font-bold mb-4">Quản lý bài viết</h2>

            <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow">
                <div className="grid gap-4">
                    <div>
                        <label className="block mb-2 font-medium">Tiêu đề</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            placeholder="Nhập tiêu đề bài viết"
                            value={newPost.title}
                            onChange={handleTitleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Slug URL</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded bg-gray-50"
                            value={newPost.slug}
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Meta Description (SEO)</label>
                        <textarea
                            className="w-full p-2 border rounded"
                            placeholder="Nhập mô tả ngắn cho SEO (150-160 ký tự)"
                            value={newPost.metaDescription}
                            onChange={(e) => setNewPost({...newPost, metaDescription: e.target.value})}
                            rows="3"
                            maxLength={160}
                        />
                        <small className="text-gray-500">
                            {newPost.metaDescription.length}/160 ký tự
                        </small>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Tags</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            placeholder="Nhập tags, phân cách bằng dấu phẩy"
                            value={newPost.tags.join(', ')}
                            onChange={handleTagsChange}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Ảnh đại diện</label>
                        <input
                            type="file"
                            className="w-full p-2 border rounded"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Trạng thái</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={newPost.status}
                            onChange={(e) => setNewPost({...newPost, status: e.target.value})}
                        >
                            <option value="draft">Bản nháp</option>
                            <option value="published">Xuất bản</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Nội dung</label>
                        <div className="border rounded">
                            <ReactQuill
                                value={newPost.content}
                                onChange={(content) => setNewPost({...newPost, content})}
                                modules={quillModules}
                                className="min-h-[300px]"
                                theme="snow"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Thêm bài viết'}
                    </button>
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map(post => (
                    <div key={post._id} className="bg-white border rounded-lg shadow p-4">
                        {post.featuredImage && (
                            <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-48 object-cover rounded mb-4"
                            />
                        )}
                        <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                        <div className="text-sm text-gray-500 mb-2">
                            <p>Slug: {post.slug}</p>
                            <p>Trạng thái: {post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}</p>
                            {post.tags && post.tags.length > 0 && (
                                <p>Tags: {post.tags.join(', ')}</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleDelete(post._id)}
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

export default BlogManagement;
