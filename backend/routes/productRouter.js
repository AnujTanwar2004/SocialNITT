const express = require("express");
const router = express.Router();
const productCtrl = require("../controllers/productCtrl");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// 📦 Products collection routes
router
  .route("/")
  .post(auth, productCtrl.createProduct)
  .get(auth, productCtrl.getProducts);

// 📦 Single product routes
router
  .route("/:id")
  .get(auth, productCtrl.getProduct)
  .patch(auth, productCtrl.updateProduct)
  .delete(auth, productCtrl.deleteProduct);

// 📦 Archive a product separately
router.route("/archive_product/:id").patch(auth, productCtrl.archiveProduct);

router.post("/contact/:id", auth, productCtrl.contactOwner);

// Admin: Get all products
router.get("/admin/all", auth, admin, productCtrl.getAllProducts);

// Admin: Edit product
router.patch("/admin/:id", auth, admin, productCtrl.updateProduct);

// Admin: Delete product
router.delete("/admin/:id", auth, admin, productCtrl.adminDeleteProduct);

router.patch('/admin/:id/approve', auth, admin, productCtrl.adminApproveProduct);
module.exports = router;
