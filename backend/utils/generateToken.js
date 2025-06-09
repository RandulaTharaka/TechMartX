import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Set JWT as HTTP-Only cookie (cookie: name, value, options)
  res.cookie("jwt", token, {
    httpOnly: true, // prevents JavaScript acess to the cookie
    secure: process.env.Node_ENV !== "development", // use secure cookies in production
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    sameSite: "Strict", // helps prevent CSRF attacks
  });
};

export default generateToken;
