const jwtToken = require("../jwt/jwtWebToken");
const User = require("../Models/userModel");
const bcrypt = require("bcryptjs");

exports.userRegister = async (req, res) => {
  try {
    const { fullname, username, email, gender, password, profilepic } =
      req.body;
    if (!fullname || !username || !email || !gender || !password) {
      return res.status(400).json({
        success: false,
        message: "Enter all the fields",
      });
    }
    const user = await User.findOne({ username, email });
    console.log(user);
    if (user) {
      return res.status(409).json({
        success: false,
        message: "Username or email already exist",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const profileBoy =
      profilepic ||
      `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const profileGirl =
      profilepic ||
      `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
      gender,
      profilepic: gender == "male" ? profileBoy : profileGirl,
    });

    if (newUser) {
      await newUser.save();
      jwtToken(newUser._id, res);
    } else {
      return res.status(500).json({
        success: false,
        message: "Invalid user data",
      });
    }
    return res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
      profilepic: newUser.profilepic,
      email: newUser.email,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill required fields",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email doesnot exist",
      });
    }
    const comparePassword = await bcrypt.compare(password, user.password || "");

    if (!comparePassword) {
      return res.status(401).json({
        success: false,
        message: "Email or Password does not matched",
      });
    }
    jwtToken(user._id, res);
    return res.status(200).json({
      success: true,
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      profilepic: user.profilepic,
      email: user.email,
      message: "Login successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.userLogout = async (req, res) => {
  try {
    res.cookie("jwt", "null", {
      maxAge: 0,
    });
    return res.status(200).json({
      success: true,
      message: "User Logout successfull",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
