const express = require("express");
const router = express.Router();
const foodCtrl = require("../controllers/foodCtrl");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
// Services collection routes
router.route("/").post(auth, foodCtrl.createFood).get(auth, foodCtrl.getFoods);

// Single service routes
router
  .route("/:id")
  .get(auth, foodCtrl.getFood)
  .patch(auth, foodCtrl.updateFood)
  .delete(auth, foodCtrl.deleteFood);

// Admin routes - use admin functions
router.get("/admin/all", auth, admin, foodCtrl.getAllFoods); // ✅ Need to add this function
router.patch("/admin/:id", auth, admin, foodCtrl.adminUpdateFood); // ✅ Use admin function
router.delete("/admin/:id", auth, admin, foodCtrl.adminDeleteFood);

router.patch('/admin/:id/approve', auth, admin, foodCtrl.adminApproveFood);

module.exports = router;
