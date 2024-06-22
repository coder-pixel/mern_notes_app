const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../util/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    res.json({
      isError: true,
      error: "User already exists",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user?._id,
      name: user?.name,
      email: user?.email,
      isAdmin: user?.isAdmin,
      pic: user?.pic,
      token: generateToken(user?._id),
      error: false,
    });
  } else {
    res.status(400);
    throw new Error("Error Ocurred!");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }); // to find user in the database -- mongoose function

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user?._id,
      name: user?.name,
      email: user?.email,
      isAdmin: user?.isAdmin,
      pic: user?.pic,
      token: generateToken(user?._id),
      error: false,
    });
  } else {
    res.status(400);
    res.json({
      isError: true,
      error: "Invalid Email or Password!",
    });
    // throw new Error("Invalid Email or Password!");
  }
});

module.exports = { registerUser, authUser };
