require('dotenv').config();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const createUserService = async (name, email, password) => {
    try{
        const user = await User.findOne({email});
        if(user){{
            console.log(">> User already exists, chon email khac: ${email}");
            return null;
            }
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        let result = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            role: "User"
    })
        return result;
    }catch(error){
        console.log(">> Error create user: ", error);
        return null;
    }
}

const loginService = async (email, password) => {
  console.log(">> loginService called with email:", email); // Debug
  
  try {
    // Tìm user theo email
    const user = await User.findOne({ email: email });
    console.log(">> User found:", user ? "Yes" : "No"); // Debug
    
    if (!user) {
      return {
        EC: 1,
        EM: "Email không tồn tại trong hệ thống"
      };
    }
    
    // So sánh mật khẩu
    const isMatchPassword = await bcrypt.compare(password, user.password);
    console.log(">> Password match:", isMatchPassword); // Debug
    
    if (!isMatchPassword) {
      return {
        EC: 2,
        EM: "Mật khẩu không chính xác"
      };
    }
    
    // Tạo token
    const payload = {
      email: user.email,
      name: user.name
    };
    
    const access_token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '1h' }
    );
    
    return {
      EC: 0,
      access_token,
      user: {
        email: user.email,
        name: user.name
      }
    };
    
  } catch (error) {
    console.log(">> Error in loginService:", error);
    return {
      EC: -1,
      EM: "Lỗi server: " + error.message
    };
  }
};

const getUserService = async () => {
  try {
    let result = await User.find({}).select("-password");
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  createUserService,
  loginService,
  getUserService
};