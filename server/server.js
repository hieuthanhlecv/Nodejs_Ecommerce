const express = require('express');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 8888


app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use('/', (req, res) => {
    res.send('SERVER ON')
} )

app.listen(port,  () => {
    console.log(`Server running on port ${port}`)
})
