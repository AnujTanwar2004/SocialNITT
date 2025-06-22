const express = require('express')
const router = express.Router()
const serviceCtrl = require('../controllers/serviceCtrl')
const auth = require('../middleware/auth')

// Services collection routes
router.route('/')
    .post(auth, serviceCtrl.createService)
    .get(auth, serviceCtrl.getServices)

// Single service routes
router.route('/:id')
    .get(auth, serviceCtrl.getService)
    .patch(auth, serviceCtrl.updateService)
    .delete(auth, serviceCtrl.deleteService)

router.post('/contact/:id', auth, serviceCtrl.contactOwner);

module.exports = router