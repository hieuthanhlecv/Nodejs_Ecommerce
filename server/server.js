const express = require('express');
require('dotenv').config()
const dbConnect = require('./config/dbconnect.js')
const initRouters = require('./routes')
const cookieParser = require('cookie-parser')

const app = express();
const port = process.env.PORT || 8888


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

dbConnect()
initRouters(app)


app.listen(port,  () => {
    console.log(`Server running on port ${port}`)
})
