const Food = require("../models/foodModel");
const Users = require("../models/userModel");

const foodCtrl = {
  createFood: async (req, res) => {
    try {
      const { title, description, budget, location, category, urgency, phone } =
        req.body;

      const userId = req.user.id;

      // Validations
      if (
        !title ||
        !description ||
        budget === undefined ||
        !location ||
        !category ||
        !phone ||
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

      const newFood = new Food({
        title,
        description,
        budget,
        location,
        category,
        urgency,
        phone,
        user: userId,
        isApproved: false, // ✅ Add this - requires admin approval
        isArchived: 0, // ✅ Default to unarchived
      });

      await newFood.save();
      await Users.findByIdAndUpdate(userId, {
        $inc: { points: 2 },
        $push: {
          pointsHistory: {
            points: 2,
            reason: "upload_product",
            date: new Date(),
          },
        },
      });

      // ✅ Updated success message
      res.json({
        msg: "Food request submitted! It will be visible after admin approval.",
      });
    } catch (err) {
      console.error("Food creation error:", err);
      return res.status(500).json({ msg: err.message });
    }
  },

  getFoods: async (req, res) => {
    try {
      // Only show approved foods to regular users
      const food = await Food.find({
        isApproved: true,
        isArchived: { $ne: 1 }, // Don't show archived items
      }).populate("user", "name avatar");
      res.json(food);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getFood: async (req, res) => {
    try {
      const food = await Food.findById(req.params.id).populate(
        "user",
        "name avatar"
      );

      if (!food) return res.status(404).json({ msg: "Food not found." });

      res.json(food);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateFood: async (req, res) => {
    try {
      const {
        title,
        description,
        budget,
        location,
        category,
        urgency,
        phone,
        status,
        isArchived,
      } = req.body;

      const food = await Food.findById(req.params.id);

      if (!food) return res.status(404).json({ msg: "Food not found." });

      // Check ownership
      if (food.user.toString() !== req.user.id)
        return res
          .status(403)
          .json({ msg: "Unauthorized: Cannot update others' Food." });

      const updatedFood = await Food.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          budget,
          location,
          category,
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

  deleteFood: async (req, res) => {
    try {
      const food = await Food.findById(req.params.id);

      if (!food) return res.status(404).json({ msg: "Food not found." });

      // Check ownership
      if (food.user.toString() !== req.user.id)
        return res
          .status(403)
          .json({ msg: "Unauthorized: Cannot delete others' food." });

      await food.deleteOne();
      await Users.findByIdAndUpdate(req.user.id, {
        $inc: { points: 1 },
        $push: {
          pointsHistory: {
            points: 1,
            reason: "delete_product",
            date: new Date(),
          },
        },
      });
      res.json({ msg: "Food deleted successfully!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  contactOwner: async (req, res) => {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ msg: "Food not found." });
    if (food.user.toString() === req.user.id) {
      return res.status(400).json({ msg: "You cannot contact yourself." });
    }
    await Notification.create({
      user: food.user,
      itemType: "Food",
      itemId: food._id,
      message: `Someone has contacted your food request "${food.title}".`,
    });
    await Users.findByIdAndUpdate(food.user, {
      $inc: { points: 1 },
      $push: {
        pointsHistory: { points: 1, reason: "contacted", date: new Date() },
      },
    });
    res.json({ msg: "Food owner notified." });
  },

  // ADMIN: Delete any food (no ownership check)
  adminDeleteFood: async (req, res) => {
    try {
      const food = await Food.findById(req.params.id);

      if (!food) return res.status(404).json({ msg: "Food not found." });

      await food.deleteOne();
      res.json({ msg: "Food deleted successfully!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // ADMIN: Update any food (no ownership check)
  adminUpdateFood: async (req, res) => {
    try {
      const {
        title,
        description,
        budget,
        location,
        category,
        urgency,
        phone,
        status,
        isArchived,
      } = req.body;

      const updatedFood = await Food.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          budget,
          location,
          category,
          urgency,
          phone,
          status,
          isArchived,
        },
        { new: true }
      );

      if (!updatedFood) return res.status(404).json({ msg: "Food not found." });

      res.json({ msg: "Food updated successfully!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // ✅ Add admin approval function
  adminApproveFood: async (req, res) => {
    try {
      const { id } = req.params;
      const { isApproved } = req.body;

      const updatedFood = await Food.findByIdAndUpdate(
        id,
        { isApproved },
        { new: true }
      );

      if (!updatedFood) {
        return res.status(404).json({ msg: "Food not found." });
      }

      res.json({
        msg: isApproved
          ? "Food approved successfully!"
          : "Food approval revoked.",
        food: updatedFood,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // ✅ Update getAllFoods for admin to see all items
  getAllFoods: async (req, res) => {
    try {
      // Admins can see all foods regardless of approval status
      const foods = await Food.find().populate("user", "name avatar");
      res.json(foods);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = foodCtrl;
