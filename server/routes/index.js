const userRouter = require('./user')
const productRouter = require('./product')
const prodcategoryRouter = require('./productCategory')
const blogcategoryRouter = require('./blogCategory')
const {notFound, errHandler} = require('../middlewares/errHandler')

const initRouters = (app) => {
    app.use('/api/user', userRouter),
    app.use('/api/product', productRouter)
    app.use('/api/prodcategory', prodcategoryRouter)
    app.use('/api/blogcategory', blogcategoryRouter)



    app.use(notFound),
    app.use(errHandler)
}

module.exports = initRouters



