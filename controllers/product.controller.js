const User = require("../models/User-model");
const Shop = require("../models/shop.model");
const Product = require("../models/product.model");
const CatchAsync = require("../utils/catch-async");
const multer = require("multer");
const cloudinary = require("cloudinary");
const QueryMethod = require("../utils/query");
const ErrorObject = require("../utils/error");

const multerStorage = multer.diskStorage({});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ErrorObject("Please upload only an image file", 400), false);
  }
};

const uploadImage = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadProductImage = uploadImage.single("image");

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const resizeImage = CatchAsync(async (req, res, next) => {
  if (req.file) {
    // let user_id = req.user._id;
    let timeStamp = Date.now();
    let productId = req.params.id;
    if (productId) {
      const product = await Product.findById(productId);
      if (!product) {
        return next(
          new ErrorObject(
            `There is no product with the is ${req.params.id}`,
            400
          )
        );
      }
      productName = `${product.name}-${timeStamp}`;
    }
    productName = `${req.body.name}-${timeStamp}`;

    const result = await cloudinary.v2.uploader.upload(
      req.file.path,
      { public_id: `${productName}` },
      function (error, result) {
        console.log(result);
      }
    );
    ProductName = result.url;
    req.body.image = ProductName;
  }

  next();
});

const createManyProducts = async (req, res) => {
  try {
    let products =  Product.insertMany(req.body)
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

const sortPrices = CatchAsync(async (req, res) => {
  const products = await Product.find({}).sort({ price: 1 });
  if (!products)
    return res.status(404).json({ error: true, message: "product not found" });
  return res.status(200).json({
    error: false,
    message: "products found",
    data: products,
  });
});

module.exports = {
  uploadProductImage,
  resizeImage,
  createAProduct,
  createManyProducts,
  productByID,
  updateProduct,
  listproductByShop,
  deleteProduct,
  listByCategories,
  listAllProducts,
  listbyLatest,
  sortPrices,
};
