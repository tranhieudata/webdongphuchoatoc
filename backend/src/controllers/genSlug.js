const generateSlug = (title) =>{
    return title
        .toLowerCase()  // Chuyển thành chữ thường
        .replace(/[^a-z0-9\s-]/g, '')  // Loại bỏ ký tự đặc biệt
        .trim()  // Loại bỏ khoảng trắng thừa
        .replace(/\s+/g, '-')  // Thay khoảng trắng bằng dấu gạch ngang
        .replace(/-+/g, '-');  // Loại bỏ dấu gạch ngang dư thừa
}

export default generateSlug