const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : 'Cannot create new product'
    })
})


const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid)
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get product'
    })
})



//Filtering, sorting & pagination
const getAllProducts = asyncHandler(async (req, res) => {
    const queries = {...req.query}
    // Tách các trường đặc biệt ra khỏi query
    const exculeFields = ['limit', 'sort', 'page', 'fields']
    exculeFields.forEach(el => delete queries[el])
    // Format lại các operators cho đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, mactheEl => `$${mactheEl}`)
    const formatedQueries = JSON.parse(queryString) 
    console.log(formatedQueries);
    //Filtering
    if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' } //'i' không phân biệt hoa thường
    let queryCommand = Product.find(formatedQueries)


    //Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ') //vd chuyeenr ab,cd=>[ab,cd]=>ab cd
        queryCommand= queryCommand.sort(sortBy)
    }
    //Execute query
    queryCommand.exec()
        .then(async(response) => {
            const counts = await Product.find(formatedQueries).countDocuments();
            return res.status(200).json({
                success: response ? true : false,
                products: response ? response : 'Cannot get products',
                counts
            })
        })
        .catch((err) => {
            throw new Error(err.message);
        });
})





const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updateProduct = await Product.findByIdAndUpdate(pid, req.body, { new:true })
    return res.status(200).json({
        success: updateProduct ? true : false,
        updateProduct: updateProduct ? updateProduct : 'Cannot get product'
    })
})



const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const deleteProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deleteProduct ? true : false,
        deleteProduct: deleteProduct ? deleteProduct : 'Cannot delete product'
    })
})




module.exports = {
    createProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
}





