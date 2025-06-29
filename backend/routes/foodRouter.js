const express = require('express')
const router = express.Router()
const foodCtrl = require('../controllers/foodCtrl')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin');
// Services collection routes
router.route('/')
    .post(auth, foodCtrl.createFood)
    .get(auth, foodCtrl.getFoods)

// Single service routes
router.route('/:id')
    .get(auth, foodCtrl.getFood)
    .patch(auth, foodCtrl.updateFood)
    .delete(auth, foodCtrl.deleteFood)

router.get('/admin/all', auth, admin, foodCtrl.getFoods);
// routes for the admin
router.post('/contact/:id', auth, foodCtrl.contactOwner);
router.patch('/admin/:id', auth, admin, foodCtrl.adminUpdateFood);
router.delete('/admin/:id', auth, admin, foodCtrl.adminDeleteFood);

module.exports = router