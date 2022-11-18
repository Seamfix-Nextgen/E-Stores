const SavedProduct = require("../models/savedProduct");
const CatchAsync = require("../utils/catch-async");

const saveAProduct = CatchAsync(async (req, res) => {
  const { productID } = req.params;
  const userID = req.user._id;
  const productAlready = await SavedProduct.findOne({
    product: productID,
    user: userID,
  });
  if (productAlready) {
    return res
      .status(409)
      .json({
        error: true,
        message: "already saved this store",
        
      });
  }
  let newSavedProduct = new SavedProduct({ product: productID, user: userID });
  await newSavedProduct.save()
  if (newSavedProduct) {
    return res.status(200).json({
      error: false,
      message: "Store saved successfully",
      data: newSavedProduct,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Bad request",
    });
  }
});


const getSavedProducts = CatchAsync (async (req,res)=>{
     const userID = req.user._id;
     const SavedProducts = await SavedProduct.find({
       user: userID,
     });
     if (SavedProducts) {
       return res.status(200).json({
         error: true,
         message: "already saved this store",
         SavedProducts
       });
     }
})

module.exports = { saveAProduct, getSavedProducts };
