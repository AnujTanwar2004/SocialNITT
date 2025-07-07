const Services = require("../models/serviceModel");
const Users = require("../models/userModel");
const Notification = require("../models/notificationModel");

const serviceCtrl = {
  createService: async (req, res) => {
    try {
      const {
        title,
        description,
        budget,
        location,
        category,
        serviceType,
        urgency,
        phone,
      } = req.body;

      const userId = req.user.id;

      // Validations
      if (
        !title ||
        !description ||
        budget === undefined ||
        !location ||
        !category ||
        !phone ||
        !serviceType ||
        !urgency
      )
        return res.status(400).json({ msg: "Please fill in all fields." });

      if (title.length < 5)
        return res
          .status(400)
          .json({ msg: "Title must be at least 5 characters." });

      if (description.length < 10)
        return res
          .status(400)
          .json({ msg: "Description must be at least 10 characters." });

      if (budget < 0)
        return res
          .status(400)
          .json({ msg: "Budget must be a positive number." });

      const newService = new Services({
        title,
        description,
        budget,
        location,
        category,
        serviceType,
        urgency,
        phone,
        user: userId,
        isApproved: false, // ✅ Add this - requires admin approval
        isArchived: 0 // ✅ Default to unarchived
      });

      await newService.save();
      await Users.findByIdAndUpdate(userId, {
        $inc: { points: 2 },
        $push: {
          pointsHistory: {
            points: 2,
            reason: "upload_service",
            date: new Date(),
          },
        },
      });
      
      // ✅ Updated success message
      res.json({ msg: "Service request submitted! It will be visible after admin approval." });
    } catch (err) {
      console.error("Service creation error:", err);
      return res.status(500).json({ msg: err.message });
    }
  },

  // ✅ Update getServices to only show approved items
  getServices: async (req, res) => {
    try {
      // Only show approved services to regular users
      const services = await Services.find({ 
        isApproved: true,
        isArchived: { $ne: 1 } // Don't show archived items
      }).populate("user", "name avatar");
      res.json(services);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getService: async (req, res) => {
    try {
      const service = await Services.findById(req.params.id).populate(
        "user",
        "name avatar"
      );

      if (!service) return res.status(404).json({ msg: "Service not found." });

      res.json(service);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateService: async (req, res) => {
    try {
      const {
        title,
        description,
        budget,
        location,
        category,
        serviceType,
        urgency,
        phone,
        status,
        isArchived,
      } = req.body;

      const service = await Services.findById(req.params.id);

      if (!service) return res.status(404).json({ msg: "Service not found." });

      // ✅ Check ownership - allow if user owns it OR if user is admin
      const isOwner = service.user.toString() === req.user.id;
      const isAdmin = req.user.role === 1;
      
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ msg: "Unauthorized: Cannot update others' service." });
      }

      const updatedService = await Services.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          budget,
          location,
          category,
          serviceType,
          urgency,
          phone,
          status,
          isArchived,
        },
        { new: true }
      );

      res.json({ msg: "Service updated successfully!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteService: async (req, res) => {
    try {
      const service = await Services.findById(req.params.id);

      if (!service) return res.status(404).json({ msg: "Service not found." });

      // Check ownership
      if (service.user.toString() !== req.user.id)
        return res
          .status(403)
          .json({ msg: "Unauthorized: Cannot delete others' service." });

      await service.deleteOne();
      await Users.findByIdAndUpdate(req.user.id, {
        $inc: { points: 1 },
        $push: {
          pointsHistory: {
            points: 1,
            reason: "delete_service",
            date: new Date(),
          },
        },
      });
      res.json({ msg: "Service deleted successfully!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  contactOwner: async (req, res) => {
    try {
      const service = await Services.findById(req.params.id);
      if (!service) return res.status(404).json({ msg: "Service not found." });
      if (service.user.toString() === req.user.id) {
        return res.status(400).json({ msg: "You cannot contact yourself." });
      }
      await Notification.create({
        user: service.user, // ✅ Fixed: was using 'product.user'
        itemType: "Service",
        itemId: service._id,
        message: `Someone has contacted your service "${service.title}".`,
      });
      await Users.findByIdAndUpdate(service.user, { // ✅ Fixed: was using 'product.user'
        $inc: { points: 1 },
        $push: {
          pointsHistory: { points: 1, reason: "contacted", date: new Date() },
        },
      });
      res.json({ msg: "Service owner notified." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // ✅ Add admin approval function
  adminApproveService: async (req, res) => {
    try {
      const { id } = req.params;
      const { isApproved } = req.body;

      const updatedService = await Services.findByIdAndUpdate(
        id,
        { isApproved },
        { new: true }
      );

      if (!updatedService) {
        return res.status(404).json({ msg: "Service not found." });
      }

      res.json({ 
        msg: isApproved ? "Service approved successfully!" : "Service approval revoked.",
        service: updatedService 
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // ADMIN: Delete any service (no ownership check)
  adminDeleteService: async (req, res) => {
    try {
      const service = await Services.findById(req.params.id);

      if (!service) return res.status(404).json({ msg: "Service not found." });

      await service.deleteOne();
      res.json({ msg: "Service deleted successfully!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // ADMIN: Update any service (no ownership check)
  adminUpdateService: async (req, res) => {
    try {
      const {
        title,
        description,
        budget,
        location,
        category,
        serviceType,
        urgency,
        phone,
        status,
        isArchived,
      } = req.body;

      const updatedService = await Services.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          budget,
          location,
          category,
          serviceType,
          urgency,
          phone,
          status,
          isArchived,
        },
        { new: true }
      );

      if (!updatedService)
        return res.status(404).json({ msg: "Service not found." });

      res.json({ msg: "Service updated successfully!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

 getAllServices: async (req, res) => {
  try {
     const services = await Services.find().populate("user", "name avatar");
    res.json(services);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
},
};

module.exports = serviceCtrl;