const Services = require('../models/serviceModel')

const serviceCtrl = {
  createService: async (req, res) => {
    try {
      const {
        title, description, budget, location, category, serviceType, urgency, phone
      } = req.body

      const userId = req.user.id

      // Validations
      if (!title || !description || budget === undefined || !location || !category || !phone || !serviceType || !urgency)
        return res.status(400).json({ msg: "Please fill in all fields." })

      if (title.length < 5)
        return res.status(400).json({ msg: "Title must be at least 5 characters." })

      if (description.length < 10)
        return res.status(400).json({ msg: "Description must be at least 10 characters." })

      if (budget < 0)
        return res.status(400).json({ msg: "Budget must be a positive number." })

      const newService = new Services({
        title,
        description,
        budget,
        location,
        category,
        serviceType,
        urgency,
        phone,
        user: userId
      })

      await newService.save()
      res.json({ msg: "Service request created successfully!" })

    } catch (err) {
      console.error("Service creation error:", err)
      return res.status(500).json({ msg: err.message })
    }
  },

  getServices: async (req, res) => {
    try {
      const services = await Services.find().populate('user', 'name avatar')
      res.json(services)
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },

  getService: async (req, res) => {
    try {
      const service = await Services.findById(req.params.id).populate('user', 'name avatar')

      if (!service)
        return res.status(404).json({ msg: "Service not found." })

      res.json(service)
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },

  updateService: async (req, res) => {
    try {
      const {
        title, description, budget, location, category, serviceType, urgency, phone, status, isArchived
      } = req.body

      const service = await Services.findById(req.params.id)
      
      if (!service)
        return res.status(404).json({ msg: "Service not found." })

      // Check ownership
      if (service.user.toString() !== req.user.id)
        return res.status(403).json({ msg: "Unauthorized: Cannot update others' service." })

      const updatedService = await Services.findByIdAndUpdate(
        req.params.id,
        {
          title, description, budget, location, category, serviceType, urgency, phone, status, isArchived
        },
        { new: true }
      )

      res.json({ msg: "Service updated successfully!" })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },

  deleteService: async (req, res) => {
    try {
      const service = await Services.findById(req.params.id)

      if (!service)
        return res.status(404).json({ msg: "Service not found." })

      // Check ownership
      if (service.user.toString() !== req.user.id)
        return res.status(403).json({ msg: "Unauthorized: Cannot delete others' service." })

      await service.deleteOne()
      res.json({ msg: "Service deleted successfully!" })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  }
}

module.exports = serviceCtrl