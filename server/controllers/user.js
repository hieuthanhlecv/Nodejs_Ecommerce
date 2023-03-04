const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const {generateAccessToken, generateRefreshToken} = require('../middlewares/jwt')
const jwt =  require('jsonwebtoken')





const register = asyncHandler(async(req, res) => {
    const  {email, password, firstname, lastname} = req.body
    if (!email || !password || !firstname || !lastname)
    return res.status(400).json({
        sucess: false,
        mess: 'Missing inputs'
    })
    const user = await User.findOne({email})
    if (user) throw new Error('User has existed!')
    else {
        const newUser = await User.create(req.body)
        return res.status(200).json({
            sucess: newUser ? true : false,
            mes: newUser ? 'Register is successfully. Please go login ' : 'Something went wrong'
        })
    }
})



// Refresh  token => cấp mới access token
// Access token  =>  Xác thực người dùng, quyền người dùng
const login = asyncHandler(async(req, res) => {
    const  {email, password} = req.body
    if (!email || !password)
    return res.status(400).json({
        sucess: false,
        mess: 'Missing inputs'
    })
    const response = await User.findOne({email})
    if (response && await response.isCorrectPassword(password)) {
        //Tách password và role ra khỏi response
        const {password, role, ...userData} = response.toObject()
        //Tạo access Token
        const accessToken = generateAccessToken(response._id, role)
        //Tạo refresh token
        const refreshToken = generateRefreshToken(response._id)
        //Lưu refreshToken vào database
        await User.findByIdAndUpdate(response._id, {refreshToken}, {new:true})
        //lưu refresh token vào cookie và thời gian 7 ngày
        res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge:7*24*60*60*1000})
        return res.status(200).json({
            sucess: true,
            accessToken,
            userData

        })
    } else{
        throw new Error('Invalid credentials!')
    }
})



const getCurrent = asyncHandler(async(req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id).select('-refreshToken -password -role')
    return res.status(200).json({
        sucess: false,
        rs: user ? user : 'User not found'
    })

})


const refreshAccessToken = asyncHandler (async (req, res) => {
    // lấy token từ cookie
    const cookie = req.cookies
    // check xem có token hay không
    if (!cookie && !cookie.refreshToken) throw new Error('No refresh token in cookies')
    // check token có hợp lệ hay không
    const  rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await User.findById({_id: rs._id, refreshToken: cookie.refreshToken})
    return res.status(200).json({
        sucess: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id,  response.role) : 'Refresh token invalid'
    })
}) 

const  logout = asyncHandler (async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    //xóa refresh token ở db
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken}, {refreshToken: ''}, {new: true})
    // xóa refresh token ở cookie trình duyệt
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        sucess: true,
        mes: 'Logout sucessfully'
    })
}) 


module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
}










