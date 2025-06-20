const Food = require('../models/foodModel')

const foodCtrl = {
  createFood: async (req, res) => {
    try {
      const {
        title, description, budget, location, category, urgency, phone
      } = req.body

      const userId = req.user.id

      // Validations
      if (!title || !description || budget === undefined || !location || !category || !phone  || !urgency)
        return res.status(400).json({ msg: "Please fill in all fields." })

      if (title.length < 5)
        return res.status(400).json({ msg: "Title must be at least 5 characters." })

      if (description.length < 10)
        return res.status(400).json({ msg: "Description must be at least 10 characters." })

      if (budget < 0)
        return res.status(400).json({ msg: "Budget must be a positive number." })

      const newFood = new Food({
        title,
        description,
        budget,
        location,
        category,
         urgency,
        phone,
        user: userId
      })

      await newFood.save()
      res.json({ msg: "Food request created successfully!" })

    } catch (err) {
      console.error("Food creation error:", err)
      return res.status(500).json({ msg: err.message })
    }
  },

  getFoods: async (req, res) => {
    try {
      const food = await Food.find().populate('user', 'name avatar')
      res.json(food)
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },

  getFood: async (req, res) => {
    try {
      const food = await Food.findById(req.params.id).populate('user', 'name avatar')

      if (!food)
        return res.status(404).json({ msg: "Food not found." })

      res.json(food)
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },

  updateFood: async (req, res) => {
    try {
      const {
        title, description, budget, location, category , urgency, phone, status, isArchived
      } = req.body

      const food = await Food.findById(req.params.id)
      
      if (!food)
        return res.status(404).json({ msg: "Food not found." })

      // Check ownership
      if (food.user.toString() !== req.user.id)
        return res.status(403).json({ msg: "Unauthorized: Cannot update others' Food." })

      const updatedFood = await Food.findByIdAndUpdate(
        req.params.id,
        {
          title, description, budget, location, category, urgency, phone, status, isArchived
        },
        { new: true }
      )

      res.json({ msg: "Service updated successfully!" })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },

  deleteFood: async (req, res) => {
    try {
      const food = await Food.findById(req.params.id)

      if (!food)
        return res.status(404).json({ msg: "Food not found." })

      // Check ownership
      if (food.user.toString() !== req.user.id)
        return res.status(403).json({ msg: "Unauthorized: Cannot delete others' food." })

      await food.deleteOne()
      res.json({ msg: "Food deleted successfully!" })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  }
}

module.exports = foodCtrl