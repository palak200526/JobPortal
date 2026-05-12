const asyncHandler = require("../utils/asyncHandler");
const categoryModel = require("../models/categoryModel");
const { sendSuccess } = require("../utils/apiResponse");

exports.getCategories = asyncHandler(async (_req, res) => {
  const categories = await categoryModel.getAllCategories();
  sendSuccess(res, "Categories fetched", categories);
});
