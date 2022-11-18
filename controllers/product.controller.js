const User = require("../models/User-model");
const Shop = require("../models/shop.model");
const Product = require("../models/product.model");

const createManyProducts = async (req, res) => {
  try {
    let products = Product.insertMany(req.body)
      .then((products) => {
        return res.status(200).json({
          error: false,
          message: "product quantity updated",
          data: products,
        });
      })
      .catch(() => {
        return res.status(400).json({ error: true, message: "bad request" });
      });
  } catch (error) {}
};

const createAProduct = async (req, res) => {
  try {
    const { name, images, description, category, quantity, price, shop } =
      req.body;
    // const shopOwner = await User.findById(userID);
    // const shop = await Shop.findOne({ "owner.fullName": shopOwner.fullName });
    const productExists = await Product.findOne({ name });

    // if (!shopOwner)
    //   return res
    //     .status(401)
    //     .json({ error: true, message: "unauthorized access" });
    // if (!shop)
    //   return res
    //     .status(401)
    //     .json({ error: true, message: "unauthorized access" });

    if (productExists) {
      productExists.quantity += parseInt(quantity);
      await productExists.save();
      console.log(productExists);
      return res
        .status(200)
        .json({ error: false, message: "product quantity updated" });
    } else {
      let newProduct = await new Product({
        name,
        images,
        description,
        category,
        quantity,
        price,
        shop,
      });

      // newProduct = await newProduct.populate("shop").execPopulate();

      if (newProduct) {
        await newProduct.save();
        return res
          .status(200)
          .json({ error: false, message: "product added to your shop" });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

const productByID = async (req, res) => {
  try {
    const { productID } = req.params;
    const product = await Product.findById(productID).select("-reviews");
    if (!product)
      return res
        .status(404)
        .json({ error: true, message: "product not found" });
    return res.status(200).json({
      error: false,
      message: "product found",
      data: product,
    });
  } catch (error) {
    console.log(error?.message);
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    // only shop owner can update product in their shop
    const { productID } = req.params;
    // const { userID } = req.params;
    const { name, images, description, category, quantity, price } = req.body;
    const productExists = await Product.findOneAndUpdate(
      { _id: productID },
      { name, images, description, category, quantity, price },
      { new: true }
    );
    if (!productExists) {
      return res
        .status(404)
        .json({ error: true, message: "porduct not found in your shop" });
    }
    return res.status(200).json({
      error: false,
      message: "product updated",
      data: productExists,
    });
  } catch (error) {
    console.log(error?.message);
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
    });
  }
};

const listproductByShop = async (req, res) => {
  try {
    const { shopID } = req.params;
    const products = await Product.find({ shop: shopID })
      .populate("shop", "name")
      .select("-reviews");
    console.log(products, shopID);
    if (!products)
      return res
        .status(404)
        .json({ error: true, message: "No products in store" });
    return res.status(200).json({
      error: false,
      message: "products found",
      data: products,
    });
  } catch (error) {
    console.log(error?.message);
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { producID } = req.params;
    const { userID } = req.params;
    // only shop owner can delete product in their shop
    const deletedProduct = await Product.findOneAndDelete({
      _id: producID,
      "shop.owner._id": userID,
    });
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ error: true, message: "this is not found in your store" });
    }
    return res.status(200).json({
      error: false,
      message: "product deleted",
    });
  } catch (error) {
    console.log(error?.message);
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
    });
  }
};

const listByCategories = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({ category: category });
    if (!products) {
      return res
        .status(404)
        .json({ error: true, message: "category not found" });
    }
    return res.status(200).json({
      error: false,
      message: "products found",
      data: products,
    });
  } catch (error) {
    console.log(error?.message);
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
    });
  }
};
const listAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).select("-reviews");
    if (!products)
      return res
        .status(404)
        .json({ error: true, message: "product not found" });
    return res.status(200).json({
      error: false,
      message: "products found",
      data: products,
    });
  } catch (error) {
    console.log(error?.message);
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
    });
  }
};
const listbyLatest = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ updatedAt: -1 });
    if (!products)
      return res
        .status(404)
        .json({ error: true, message: "product not found" });
    return res.status(200).json({
      error: false,
      message: "products found",
      data: products,
    });
  } catch (error) {
    console.log(error?.message);
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
    });
  }
};


module.exports = {
  createAProduct,
  createManyProducts,
  productByID,
  updateProduct,
  listproductByShop,
  deleteProduct,
  listByCategories,
  listAllProducts,
  listbyLatest,
};
