const express = require('express')
const router = express.Router()
const productCtrl = require('../controllers/productCtrl')
const auth = require('../middleware/auth')

// 📦 Products collection routes
router.route('/')
    .post(auth, productCtrl.createProduct)
    .get(auth, productCtrl.getProducts)

// 📦 Single product routes
router.route('/:id')
    .get(auth, productCtrl.getProduct)
    .patch(auth, productCtrl.updateProduct)
    .delete(auth, productCtrl.deleteProduct)

// 📦 Archive a product separately
router.route('/archive_product/:id')
    .patch(auth, productCtrl.archiveProduct)

module.exports = router
