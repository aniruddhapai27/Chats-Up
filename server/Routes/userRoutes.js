const express = require("express");
const { isLogin } = require("../middleware/isLogin");
const {
  getUserBySearch,
  getCurrentChats,
} = require("../Controllers/userController");
const router = express.Router();

router.get("/search", isLogin, getUserBySearch);
router.get("/current-chats", isLogin, getCurrentChats);
module.exports = router;
