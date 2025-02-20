const {
  userRegister,
  userLogin,
  userLogout,
} = require("../Controllers/authController");
const express = require("express");
const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/logout", userLogout);
module.exports = router;
