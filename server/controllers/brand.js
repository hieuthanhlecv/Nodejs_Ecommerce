const Brand = require('../models/brand')
const asyncHandler = require('express-async-handler')

const createNewBrand = asyncHandler(async(req, res) => {
      const response = await Brand.create(req.body)
      return res.status(200).json({
            success: response ? true : false,
            createBrand: response ? response : 'Cannot create new brand'
      })
})



const getBrands = asyncHandler(async (req, res) => {
      const response = await Brand.find()
      return res.status(200).json({
            success: response ? true : false,
            Brands: response ? response : 'cannot get brand'
      })
})


const updateBrand = asyncHandler(async (req, res) => {
      const {bid} = req.params
      const response = await Brand.findByIdAndUpdate(bid, req.body, {new:true})
      return res.status(200).json({
            success: response ? true : false,
            updateBrand: response ? response : 'cannot update brand'
      })
})




const deleteBrand = asyncHandler(async (req, res) => {
      const {bid} = req.params
      const response = await Brand.findByIdAndDelete(bid)
      return res.status(200).json({
            success: response ? true : false,
            deleteCategory: response ? response : 'cannot delete brand'
      })
})


module.exports = {
      createNewBrand,
      getBrands,
      updateBrand,
      deleteBrand
}