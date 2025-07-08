export const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // required for SameSite=None
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // cross-site cookie needs None
    path: "/", // ✅ add this to make it accessible site-wide
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    message,
    token,
  });
};
