const User = require("../models/User-model");
const Shop = require("../models/shop.model");
const Product = require("../models/product.model");

const createShop = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const { userID } = req.params;
    const shopOwner = req.user;
    const shopExists = await Shop.findOne({ name: name });

    if (shopExists)
      return res.status(409).json({
        error: true,
        message: `a shop with this name '${shopExists.name}' already exist`,
      });

    // create a new shop

    const newStore = await Shop.create({
      name,
      description,
      owner: shopOwner._id,
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
    const { name, description, owner } = req.body;
    const { shopID } = req.params;
    const shop = await Shop.findById(shopID);
    console.log(req.user._id);
    if (shop.owner._id !== req.user._id) {
      return res
        .status(401)
        .json({ error: true, message: "unauthorized access" });
    }
    const updatedShop = await Shop.findByIdAndUpdate(
      shopID,
      { name, description, owner },
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

    const shop = await Shop.findOne({ name: name });

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
  //  check if shop to be deleted exists
  const deletedShop = await Shop.findOneAndDelete({ _id: shopID, owner: req.user })
    .then((result) => {
      if(!result) return  res.status(404).json({ error: true, message: "shop not found" });

      return res.status(200).json({
        error: false,
        message: "shop deleted successfully",
        data: result,
      });
    })
    .catch((error) => {
      console.log(error?.message);
      return res.status(500).json({ error: true, message: "oops something went wrong" });
    });
};

module.exports = {
  createShop,
  editShop,
  getShopByName,
  getAllShops,
  deleteShop,
};
