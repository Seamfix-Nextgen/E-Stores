const User = require("../models/User-model");
const Shop = require("../models/shop.model");
const Product = require("../models/product.model");
const multer = require("multer");
const CatchAsync = require("../utils/catch-async");
const QueryMethod = require("../utils/query.js");
const ErrorObject = require("../utils/error");
const cloudinary = require("cloudinary");

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

const uploadShopImage = uploadImage.single("image");

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});
const resizeImage = CatchAsync(async (req, res, next) => {
  if (req.file) {
    // let user_id = req.user._id;
    let id = req.params.id;
    if (id) {
      const shop = await Shop.findById(id);
      if (!shop) {
        return next(
          new ErrorObject(`There is no shop with the is ${req.params.id}`, 400)
        );
      }
      shopName = `${shop.name}`;
    }
    shopName = `${req.body.name}`;

    const result = await cloudinary.v2.uploader.upload(
      req.file.path,
      { public_id: `${shopName}` },
      function (error, result) {
        // console.log(result);
      }
    );
    ShopName = result.url;
    req.body.image = ShopName;
  }

  next();
});

const createShop = CatchAsync(async (req, res, next) => {
  const { name, description, image } = req.body;
  // const { userID } = req.params;
  // const shopOwner = await User.findById(userID);
  const shopExists = await Shop.findOne({ name: name });
  if (shopExists) {
    return res.status(409).json({
      error: true,
      message: `a shop with this name ${shopExists.name} already exist`,
    });
  }

  // create a new shop
  let id = req.user._id;
  const newStore = await Shop.create({
    name,
    description,
    owner: id,
    image,
  });
  if (newStore) {
    return res.status(200).json({
      error: false,
      message: "Your shop has been created successfully",
      data: newStore,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Bad request",
    });
  }
});

const editShop = CatchAsync(async (req, res, next) => {
  const { shopID } = req.params;
  const userID = req.user._id;
  const shop = await Shop.findById(shopID);
  // validate the owner of the store
  const validStoreOwner = await User.findById(userID);
  // !validStoreOwner ||
  if (req.user.role !== "admin") {
    if (validStoreOwner._id.toString() !== shop.owner.toString()) {
      return res
        .status(401)
        .json({ error: true, message: "unauthorized access" });
    }
  }
  const name = req.body.name === undefined ? shop.name : req.body.name;
  const description =
    req.body.description === undefined
      ? shop.description
      : req.body.description;
  const image = req.body.image === undefined ? shop.image : req.body.image;
  const address =
    req.body.address === undefined ? shop.address : req.body.address;
  const phoneNumber =
    req.body.phoneNumber === undefined
      ? shop.phoneNumber
      : req.body.phoneNumber;
  const updateShop = { name, description, phoneNumber, image, address };
  const updatedShop = await Shop.findByIdAndUpdate(shopID, updateShop, {
    new: true,
  });

  if (updatedShop) {
    return res.status(200).json({
      error: false,
      message: "update successful",
      data: updatedShop,
    });
  } else {
    return res.status(404).json({ error: true, message: "Shop not found" });
  }
});

// get one shop
const getOneShop = CatchAsync(async (req, res, next) => {
  const { shopID } = req.params;
  const shop = await Shop.findById(shopID);
  if (!shop) {
    return next(new ErrorObject(`There is no shop with the id ${shopID}`, 400));
  }
  res.status(200).json({
    status: "success",
    data: {
      shop,
    },
  });
});

const getShopByName = async (req, res) => {
  // everybody can get the store
  try {
    const { name } = req.query;
    const shop = await Shop.findOne({ name });
    if (shop) {
      return res.status(200).json({
        error: false,
        message: "shop found",
        data: {
          shop,
        },
      });
    } else {
      return res.status(404).json({ error: true, message: "shop not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
const getAllShops = CatchAsync(async (req, res, next) => {
  let queriedShops = new QueryMethod(Shop.find(), req.query)
    .sort()
    .filter()
    .limit()
    .paginate();
  let shops = await queriedShops.query;
  if (shops) {
    return res.status(200).json({
      error: false,
      message: "Shops Availble",
      data: {
        shops,
      },
    });
  } else {
    return res
      .status(404)
      .json({ error: true, message: "No shops availiable" });
  }
});

const deleteShop = async (req, res) => {
  const { shopID } = req.params;
  const userID = req.user._id;
  //  check if shop to be deleted exists
  const storeToBeDeleted = await Shop.findById(shopID);
  if (!storeToBeDeleted) {
    return res.status(404).json({ error: true, message: "shop not found" });
  }
  // validate the owner of the store
  const validStoreOwner = await User.findById(userID);
  if (req.user.role !== "admin") {
    if (
      !validStoreOwner ||
      validStoreOwner._id.toString() !== storeToBeDeleted.owner.toString()
    ) {
      return res
        .status(401)
        .json({ error: true, message: "unauthorized access" });
    }
  }
  await Shop.findByIdAndDelete(shopID);
  res.status(204).json({
    status: "success",
  });
};

module.exports = {
  createShop,
  editShop,
  getShopByName,
  getAllShops,
  uploadShopImage,
  resizeImage,
  deleteShop,
  getOneShop,
};
