const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

// === CÁC ROUTE PUBLIC (không cần token) ===
routerAPI.get("/", (req, res) => {
  return res.status(200).json("Hello world api");
});

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);

// === TỪ ĐÂY TRỞ XUỐNG, TẤT CẢ ROUTE ĐỀU CẦN TOKEN ===
routerAPI.use(auth);  // Áp dụng middleware auth cho các route bên dưới

routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

module.exports = routerAPI;