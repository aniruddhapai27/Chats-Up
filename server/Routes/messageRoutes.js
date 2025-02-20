const express = require("express");
const {
  sendMessage,
  getMessages,
} = require("../Controllers/messageController");
const { isLogin } = require("../middleware/isLogin");
const router = express.Router();

router.post("/send/:id", isLogin, sendMessage);
router.get("/:id", isLogin, getMessages);
module.exports = router;
