const router = require('express').Router()
const ctrls = require('../controllers/blog')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewBlog)
router.put('/:bid', [verifyAccessToken, isAdmin], ctrls.updateBlog)
router.get('/', ctrls.getBlog)
router.delete('/:bid',[verifyAccessToken, isAdmin], ctrls.deleteBlog)




module.exports = router