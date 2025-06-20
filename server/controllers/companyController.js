import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";

export const getCompanies = catchAsyncErrors(async (req, res, next) => {
  const companies = await User.aggregate([
    { $match: { role: "Employer" } },
    {
      $lookup: {
        from: "jobs",
        localField: "_id",
        foreignField: "postedBy",
        as: "jobs",
      },
    },
    {
      $addFields: {
        jobCount: { $size: "$jobs" },
      },
    },
    {
      $project: {
        _id: 0,
        company: 1,
        jobCount: 1,
      },
    },
  ]);

  if (!companies || companies.length === 0) {
    return next(new ErrorHandler("No companies found", 404));
  }

  res.status(200).json({
    success: true,
    companies,
  });
});
