const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const uploadImage = require('../middleware/uploadImage')
const uploadCtrl = require('../controllers/uploadCtrl')

// POST: Upload Avatar
router.post('/upload_avatar', auth, uploadImage, uploadCtrl.uploadAvatar)

module.exports = router
