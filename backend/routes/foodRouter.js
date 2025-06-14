const express = require('express')
const router = express.Router()
const foodCtrl = require('../controllers/foodCtrl')
const auth = require('../middleware/auth')

// Services collection routes
router.route('/')
    .post(auth, foodCtrl.createFood)
    .get(auth, foodCtrl.getFoods)

// Single service routes
router.route('/:id')
    .get(auth, foodCtrl.getFood)
    .patch(auth, foodCtrl.updateFood)
    .delete(auth, foodCtrl.deleteFood)

module.exports = router