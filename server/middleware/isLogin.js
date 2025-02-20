const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

exports.isLogin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log(token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access - Invalid Token",
      });
    }

    const user = await User.findById(decode.userId).select("-password");
    console.log(user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(`Error is in login middleware: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Unauthorized access - Invalid Token",
    });
  }
};
