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

    //fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }

    //pagination
    const page = +req.query.page || 1   
    const limit = +req.query.limit || process.env.LIMIT_PRODUCT   //mặc định là 10sp
    const skip = (page - 1) * limit
    queryCommand = queryCommand.skip(skip).limit(limit)


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
                counts,
                products: response ? response : 'Cannot get products',
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




const ratings = asyncHandler(async(req, res) => {
    const {_id} = req.user
    const {star, comment, pid} = req.body
    if (!star || !pid) throw new Error('Missing Input')
    const ratingProduct = await Product.findById(pid)
    const alreadyRating = ratingProduct?.ratings?.find(el => el.postedBy.toString() === _id)
    console.log(alreadyRating);

    if(alreadyRating){
        // update start and ratings
        await Product.updateOne({
            ratings: {$elemMatch: alreadyRating}
        }, {
            $set: { "ratings.$.star": star, "ratings.$.comment": comment }
        }, { new: true })
    } else{
        // add star and ratings
        await Product.findByIdAndUpdate(pid, {
          $push: {ratings: {star, comment, postedBy: _id}}
        }, {new: true})
    }

    //tính tổng sum totalRatings
    const updatedProduct = await Product.findByIdAndUpdate(pid)
    const ratingCount = updatedProduct.ratings.length
    const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + +el.star, 0)
    updatedProduct.totalRatings = Math.round(sumRatings * 10 / ratingCount ) / 10
    await updatedProduct.save()

    return res.status(200).json({
        status: true,
        updatedProduct
    })
})




const uploadImagesProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (!req.files) throw new Error('Missing Input')
    const response = await Product.findByIdAndUpdate(pid, {$push: {images: {$each: req.files.map(el => el.path)}}}, {new: true})
    console.log(response);
    return res.status(200).json({
        status: response ? true : false,
        updateProduct: response ? response : 'cannot upload images product'
    })
})


module.exports = {
    createProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImagesProduct
}





