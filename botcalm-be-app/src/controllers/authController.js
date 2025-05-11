const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const { sendTokenResponse } = require("../utils/auth");

// Register user
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already in use. Please use a different email or login.",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    // Check specifically for duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error:
          "Email already registered. Please use a different email or login.",
      });
    }
    next(err);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log("Missing credentials");
      return next(new ErrorResponse("Please provide email and password", 400));
    }

    // Find user with password field included
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("User not found with email:", email);
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log("Password does not match for user:", email);
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    console.log("Successful login for:", email);
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error("Login error:", err);
    next(new ErrorResponse("Cannot login, please try again", 500));
  }
};

// Logout user / clear cookie
exports.logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};

// Get current logged in user
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
};
