const Products = require('../models/productModel');
const Notification = require('../models/notificationModel');
const Users = require('../models/userModel');
const logToFile = require('../utils/logger');

const productCtrl = {
  createProduct: async (req, res) => {
    try {
      const {
        title, description, price, location, category, phone, image
      } = req.body;

      const userId = req.user.id;

      // Validations
      if (!title || !description || price === undefined || !location || !category || !phone)
        return res.status(400).json({ msg: "Please fill in all fields." });

      if (!image || image.length === 0)
        return res.status(400).json({ msg: "Please upload image." });

      if (title.length < 5)
        return res.status(400).json({ msg: "Title must be at least 5 characters." });

      if (description.length < 10)
        return res.status(400).json({ msg: "Description must be at least 10 characters." });

      if (price < 0)
        return res.status(400).json({ msg: "Price must be a positive number." });

      const newProduct = new Products({
        title,
        description,
        price,
        location,
        category,
        phone,
        image,
        user: userId
      });

      await newProduct.save();
      await Users.findByIdAndUpdate(userId, {
        $inc: { points: 2 },
        $push: { pointsHistory: { points: 2, reason: 'upload_product', date: new Date() } }
      }); 
      res.json({ msg: "Product has been created!" });

    } catch (err) {
      console.error("Product creation error:", err);
      return res.status(500).json({ msg: err.message });
    }
  },

  getProducts: async (req, res) => {
    try {
      const products = await Products.find();
      res.json(products);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const {
        title, description, price, location, category, phone, isArchived, image
      } = req.body;

      const updatedProduct = await Products.findByIdAndUpdate(
        req.params.id,
        {
          title, description, price, location, category, phone, isArchived, image
        },
        { new: true }
      );

      if (!updatedProduct)
        return res.status(404).json({ msg: "Product not found." });

      // Log edit
      logToFile('edit.log', `User ${req.user.id} edited product ${req.params.id}`);

      res.json({ msg: "Product Updated Successfully!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getProduct: async (req, res) => {
    try {
      const product = await Products.findById(req.params.id);

      if (!product)
        return res.status(404).json({ msg: "Product not found." });

      res.json(product);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const product = await Products.findById(req.params.id);

      if (!product)
        return res.status(404).json({ msg: "Product not found." });

      if (product.user.toString() !== req.user.id)
        return res.status(403).json({ msg: "Unauthorized: Cannot delete others' product." });

      await product.deleteOne();

      // Award 1 point for deleting a product
      await Users.findByIdAndUpdate(req.user.id, { $inc: { points: 1 } });

      res.json({ msg: "Deleted Successfully!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  archiveProduct: async (req, res) => {
    try {
      const { isArchived } = req.body;

      const updatedProduct = await Products.findByIdAndUpdate(
        req.params.id,
        { isArchived },
        { new: true }
      );

      if (!updatedProduct)
        return res.status(404).json({ msg: "Product not found." });

      res.json({ msg: "Update Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // 3. Contact Owner and Create Notification
  contactOwner: async (req, res) => {
    try {
      const product = await Products.findById(req.params.id);
      if (!product) return res.status(404).json({ msg: "Product not found." });

      // Prevent notifying self
      if (product.user.toString() === req.user.id) {
        return res.status(400).json({ msg: "You cannot contact yourself." });
      }

      await Notification.create({
        user: product.user,
        itemType: 'Product',
        itemId: product._id,
        message: `Someone has contacted your product "${product.title}". Do you want to delete it now?`
      });

      // Award 1 point to the owner when contacted
      await Users.findByIdAndUpdate(product.user, { $inc: { points: 1 } });

      res.json({ msg: "Product owner notified." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
};

module.exports = productCtrl;