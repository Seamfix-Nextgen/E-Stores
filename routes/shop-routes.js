const {createShop, editShop, getShopByName, getAllShops}= require('../controllers/shop-controllers')
const express= require('express')
const router = express.Router()


router.route("/shops/create").post(createShop)
router.route("/shops/:shopID").put(editShop);
router.route("/shops/").get(getShopByName);
router.route("/shops").get(getAllShops)

