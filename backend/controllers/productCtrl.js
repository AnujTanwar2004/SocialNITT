const Products = require('../models/productModel');

const productCtrl = {
  createProduct: async (req, res) => {
    try {
      const {
        title, description, price, location, category, phone, image, user
      } = req.body;

      console.log({ title, description, price, location, category, phone, image, user });

      if (!title || !description || !price || !location || !category || !phone)
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
        title, description, price, location, category, phone, image, user
      });

      await newProduct.save();

      res.json({ msg: "Product has been created!" });

    } catch (err) {
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
        { new: true } // Important if you need the updated doc returned
      );

      if (!updatedProduct)
        return res.status(404).json({ msg: "Product not found." });

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
      const deletedProduct = await Products.findByIdAndDelete(req.params.id);

      if (!deletedProduct)
        return res.status(404).json({ msg: "Product not found." });

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
  }
};

module.exports = productCtrl;