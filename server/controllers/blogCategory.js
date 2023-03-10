const BlogCategory = require('../models/blogCategory')
const asyncHandler = require('express-async-handler')

const createBlogCategory = asyncHandler(async(req, res) => {
      const response = await BlogCategory.create(req.body)
      return res.status(200).json({
            success: response ? true : false,
            createCategory: response ? response : 'Cannot create new blog-category'
      })
})



const getBlogCategorys = asyncHandler(async (req, res) => {
      const response = await BlogCategory.find().select('title _id')
      return res.status(200).json({
            success: response ? true : false,
            BlogCategories: response ? response : 'cannot get blog-category'
      })
})


const updateBlogCategory = asyncHandler(async (req, res) => {
      const {bcid} = req.params
      const response = await BlogCategory.findByIdAndUpdate(bcid, req.body, {new:true})
      return res.status(200).json({
            success: response ? true : false,
            updateCategory: response ? response : 'cannot get blog-category'
      })
})



const deleteBlogCategory = asyncHandler(async (req, res) => {
      const {bcid} = req.params
      const response = await BlogCategory.findByIdAndDelete(bcid)
      return res.status(200).json({
            success: response ? true : false,
            deleteCategory: response ? response : 'cannot get category'
      })
})


module.exports = {
      createBlogCategory,
      getBlogCategorys,
      updateBlogCategory,
      deleteBlogCategory


}