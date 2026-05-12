require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // Các route không cần kiểm tra token
  const white_lists = ["/", "/register", "/login"];
  
  // Tạo đường dẫn cần kiểm tra (thêm prefix /v1/api)
  const currentPath = req.originalUrl;
  
  // Kiểm tra nếu là route public thì cho qua
  const isPublicRoute = white_lists.some(item => 
    currentPath === '/v1/api' + item || currentPath === item
  );
  
  if (isPublicRoute) {
    return next(); // Cho phép đi tiếp, không cần token
  }
  
  // Lấy token từ header Authorization
  const token = req.headers.authorization?.split(' ')[1];
  
  // Nếu không có token
  if (!token) {
    return res.status(401).json({
      message: "Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục."
    });
  }
  
  // Xác thực token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      email: decoded.email,
      name: decoded.name
    };
    console.log(">> Token verified: ", decoded.email);
    next(); // Cho phép đi tiếp
  } catch (error) {
    return res.status(401).json({
      message: "Token không hợp lệ hoặc đã hết hạn"
    });
  }
};

module.exports = auth;