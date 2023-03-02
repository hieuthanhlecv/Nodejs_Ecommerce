const notFound = (req, res) => {
    const error = new Error(`Route ${req.originalUrl} not found!`)
    res.status(404)
    next(error)
}

const errHandler = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    return res.status(400).json({
        success: false,
        mes: error?.message
    })
}



module.exports = {
    notFound,
    errHandler
}









