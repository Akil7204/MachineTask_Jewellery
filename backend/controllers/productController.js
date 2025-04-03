const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock, description, category, manufacturingDate } =
      req.body;
    const image = req.file ? req.file.path : "";
    const product = new Product({
      name,
      price,
      stock,
      description,
      category,
      manufacturingDate,
      image,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { search, sortBy, order, page = 1, limit = 10 } = req.query;
    
    const query = search
      ? {
          $or: [
            { name: new RegExp(search, "i") },
            { description: new RegExp(search, "i") },
          ],
        }
      : {};

    const sortOptions = sortBy ? { [sortBy]: order === "desc" ? -1 : 1 } : {};
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const totalProducts = await Product.countDocuments(query);

    const updatedProducts = products.map((product) => ({
      ...product.toObject(),
      // https://machinetask-jewellery.onrender.com
      image: product.image ? `https://machinetask-jewellery.onrender.com/${product.image.replace(/\\/g, "/")}` : null,
      // image: product.image ? `http://localhost:5000/${product.image.replace(/\\/g, "/")}` : null,
    }));

    res.json({
      products: updatedProducts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock, description, category, manufacturingDate } = req.body;

    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.file) {
      product.image = req.file.path;
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.description = description || product.description;
    product.category = category || product.category;
    product.manufacturingDate = manufacturingDate || product.manufacturingDate;

    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStockSummary = async (req, res) => {
    try {
        const stockSummary = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    totalStock: { $sum: "$stock" },
                    avgPrice: { $avg: "$price" }
                }
            }
        ]);
        res.json(stockSummary);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

