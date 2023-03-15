const router = require('express').Router()
const ctrls = require('../controllers/blog')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary')


router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewBlog)
router.put('/:bid', [verifyAccessToken, isAdmin], ctrls.updateBlog)
router.get('/', ctrls.getBlog)
router.delete('/:bid',[verifyAccessToken, isAdmin], ctrls.deleteBlog)
router.put('/image/:bid', [verifyAccessToken, isAdmin], uploader.single('image'), ctrls.uploadImagesBlog)



module.exports = router