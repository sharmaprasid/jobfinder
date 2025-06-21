import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role, company } = req.body;
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill full form !"));
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered !"));
  }
  const userData = {
    name,
    email,
    phone,
    password,
    role,
  };

  if (role === "Employer") {
    if (!company || !company.name || !company.location) {
      return next(new ErrorHandler("Please provide full company details!"));
    }
    userData.company = company;
  }

  const user = await User.create(userData);

  sendToken(user, 201, res, "User Registered Successfully !");
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email ,password and role !"));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password !", 400));
  }
  if (user.role !== role) {
    return next(new ErrorHandler(`User with provided email and ${role} not found !`, 404));
  }
  sendToken(user, 201, res, "User Logged In Sucessfully !");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(0),
    })
    .json({
      success: true,
      message: "Logged Out Successfully!",
    });
});

export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const { name, phone, company } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (name) user.name = name;
  if (phone) user.phone = phone;

  if (user.role === "Employer") {
    if (!user.company) {
      user.company = {
        name: "",
        location: "",
        industry: "",
        website: "",
      };
    }

    if (company?.name !== undefined) user.company.name = company.name;
    if (company?.location !== undefined) user.company.location = company.location;
    if (company?.industry !== undefined) user.company.industry = company.industry;
    if (company?.website !== undefined) user.company.website = company.website;
  } else if (company) {
    return next(new ErrorHandler("Job Seekers are not allowed to modify company data", 403));
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});
