import User from "../models/userModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

// @desc Auth user & get token
// @route POST/api/login
// @acess Public
const authUser = asyncHandler(async (req, res) => {
  //The await keyword is used in JavaScript with async functions to pause the execution of the function until a Promise is resolved.
  //await tells JavaScript to wait for the database to return the user before moving to the next line.
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  // await on calling user modal matchPassword method
  if (user && (await user.matchPassword(password))) {
    // create the token with jwt.sign (payload, secret, options)
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401); // 401: Unauthorized
    throw new Error("Inavlid email or password"); // for security reasons, we don't want to specify which one is invalid
  }
});

// @desc Register user
// @route POST/api/users
// @acess Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400); // 400: Bad Request (Client Error, they did something wrong)
    throw new Error("User already exists");
  }

  // Create a new user with the provided name, email, and password
  const user = await User.create({
    name,
    email,
    password,
  });

  // If user creation is successful
  if (user) {
    // Generate a token for the user and set it in the response cookie
    generateToken(res, user._id);
    // 201: Created
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400); // 400: Bad Request
    throw new Error("Invalid user data"); // If user creation fails, throw an error
  }
});

// @desc Logout user / clear cookie
// @route POST/api/users/logout
// @access Private
const logoutUser = asyncHandler(async (req, res) => {
  // Clear the JWT cookie by setting it to an empty string and setting the maxAge to 0
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // Set the expiration date to the past
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// ------------------------By User------------------------------//
// @desc Get user profile
// @route Get/api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Update user profile
// @route POST/api/users/profile // not using an id here, cuz encoded in json web token, this is user to update their own profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      // because password is hashed
      user.password = req.body.password;
    }

    const updateUser = await user.save();

    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// ------------------------By Admin------------------------------//
// @desc Get users
// @route GET/api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}); // pass empty object, to find all users
  res.status(200).json(users);
});

// @desc Get user by Id
// @route GET/api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Update user
// @route PUT/api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Delete user
// @route DELETE/api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(404);
      throw new Error("Can not delete admin user");
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
