const express = require("express");
const router = express.Router();
const serviceCtrl = require("../controllers/serviceCtrl");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Regular routes
router
  .route("/")
  .post(auth, serviceCtrl.createService)
  .get(serviceCtrl.getServices);
router
  .route("/:id")
  .get(serviceCtrl.getService)
  .patch(auth, serviceCtrl.updateService)
  .delete(auth, serviceCtrl.deleteService);

router.post("/:id/contact", auth, serviceCtrl.contactOwner);

//   Admin route 
router.get("/admin/all", auth, admin, serviceCtrl.getAllServices);
router.patch("/admin/:id", auth, admin, serviceCtrl.adminUpdateService);
router.patch(
  "/admin/:id/approve",
  auth,
  admin,
  serviceCtrl.adminApproveService
);  
router.delete("/admin/:id", auth, admin, serviceCtrl.adminDeleteService);

module.exports = router;
