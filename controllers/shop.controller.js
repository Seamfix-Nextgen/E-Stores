const User = require("../models/user");
const Shop = require("../models/shop.model");
const Product = require("../models/product.model");

const createShop = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const { userID } = req.params;
    const shopOwner = await User.findById(userID);
    const shopExists = await Shop.findOne({ name: name });

    // check if user role is shop-owner

    if (shopOwner.role !== "admin" || "shop-owner") {
      return res
        .status(401)
        .json({ error: true, message: "unauthorized access" });
    }

    // check if shop already exist in the db

    if (shopExists)
      return res.status(409).json({
        error: true,
        message: `a shop with this name '${ShopExists.name}' already exist`,
      });

    // create a new shop

    const newStore = await Shop.create({
      name,
      description,
      owner: userID,
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
  } catch (error) {
    console.log(error?.message);
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
    });
  }
};

const editShop = async (req, res) => {
  try {
    // only shop owners can edit the store
    const { name, description } = req.body;
    const { userID, shopID } = req.params;
    const shop = await Shop.findOne(shopID);
    if (shop.owner != userId) {
      return res
        .status(401)
        .json({ error: true, message: "unauthorized access" });
    }
    const updatedShop = await Shop.findByIdAndUpdate(
      shopID,
      { name, description },
      { new: true }
    );

    if (updatedShop) {
      return res.status(200).json({
        error: false,
        message: "update successful",
        data: updatedShop,
      });
    } else {
      return res.status(404).json({ error: true, message: "shop not found" });
    }
  } catch (error) {
    console.log(error?.message);
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
    });
  }
};

const getShopByName = async (req, res) => {
  // everybody can get the store

  try {
    const { name } = req.query;
    const shop = await Shop.find({ name });
    if (shop) {
      return res.status(200).json({
        error: false,
        message: "shop found",
        data: shop,
      });
    } else {
      return res.status(404).json({ error: true, message: "shop not found" });
    }
  } catch (error) {
    console.log(error?.message);
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
    });
  }
};

const getAllShops = async (req, res) => {
  // everybody can get the store

  try {
    const shops = await Shop.find({});
    if (shops) {
      return res.status(200).json({
        error: false,
        message: "shop found",
        data: shops,
      });
    } else {
      return res.status(404).json({ error: true, message: "shop not found" });
    }
  } catch (error) {
    console.log(error?.message);
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
    });
  }
};

const deleteShop = async (req, res) => {
  const { shopID } = req.params;
  const userID = req.token.id;
  //  check if shop to be deleted exists
  const storeToBeDeleted = Shop.findById(shopID);
  if (!storeToBeDeleted)
    return res.status(404).json({ error: true, message: "shop not found" });
  // validate the owner of the store (only store owners can delete store)
  const validStoreOwner = User.findById(userID);
  if (!validStoreOwner || validStoreOwner._id == storeToBeDeleted.owner)
    return res
      .status(401)
      .json({ error: true, message: "unauthorized access" });
};
storeToBeDeleted;

module.exports = { createShop, editShop, getShopByName, getAllShops };
