const Blog = require('../models/blog')
const asyncHandler = require('express-async-handler')

const createNewBlog = asyncHandler(async(req, res) => {
      const { title, description, category} = req.body
      if (!title || !description || !category ) throw new Error('Missing inputs')
      const response = await Blog.create(req.body)
      return res.status(200).json({
            success: response ? true : false,
            createdBlog: response ? response : 'Cannot create new blog'
      })
})



const updateBlog = asyncHandler(async (req, res) => {
      const {bid} = req.params
      if (Object.keys(req.body).length===0) throw new Error('Missing inputs')
      const response = await Blog.findByIdAndUpdate(bid, req.body, {new:true})
      return res.status(200).json({
            success: response ? true : false,
            updateCategory: response ? response : 'cannot update blog'
      })
})


const getBlog = asyncHandler(async (req, res) => {
      const response = await Blog.find()
      return res.status(200).json({
            success: response ? true : false,
            BlogCategories: response ? response : 'cannot get blog'
      })
})



const deleteBlog = asyncHandler(async (req, res) => {
      const {bid} = req.params
      const response = await Blog.findByIdAndDelete(bid)
      return res.status(200).json({
            success: response ? true : false,
            deleteBlog: response ? response : 'cannot delete blog'
      })
})



module.exports = {
      createNewBlog,
      updateBlog,
      getBlog,
      deleteBlog,
}