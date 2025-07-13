const express = require("express");
const router = express.Router();
const foodCtrl = require("../controllers/foodCtrl");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
// Services collection routes
router.route("/").post(auth, foodCtrl.createFood).get(auth, foodCtrl.getFoods);

// Single service routes
router.route("/:id").get(auth, foodCtrl.getFood);
router.route("/:id").patch(auth, foodCtrl.updateFood)
router.route("/:id").delete(auth, foodCtrl.deleteFood);

// Admin routes - use admin functions
router.get("/admin/all", auth, admin, foodCtrl.getAllFoods); 
router.patch("/admin/:id", auth, admin, foodCtrl.adminUpdateFood);  
router.delete("/admin/:id", auth, admin, foodCtrl.adminDeleteFood);

router.patch('/admin/:id/approve', auth, admin, foodCtrl.adminApproveFood);

module.exports = router;
