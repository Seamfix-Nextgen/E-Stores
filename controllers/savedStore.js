const SavedStore = require("../models/savedStore");
const CatchAsync = require("../utils/catch-async");

const saveAStore = CatchAsync(async (req, res) => {
  const { storeID } = req.params;
  const userID = req.user._id;
  const storedAlready = await SavedStore.findOne({
    shop: storeID,
    user: userID,
  });
  if (storedAlready) {
    return res.status(409).json({
      error: true,
      message: "already saved this store",
    });
  }
  let newSavedStore = new SavedStore({ shop: storeID, user: userID });
  await newSavedStore.save();
  if (newSavedStore) {
    return res.status(200).json({
      error: false,
      message: "Store saved successfully",
      data: newSavedStore,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Bad request",
    });
  }
});

const getSavedStores = CatchAsync(async (req, res) => {
  const userID = req.user._id;
  const savedStores = await SavedStore.find({
    user: userID,
  });
  if (savedStores) {
    return res.status(200).json({
      error: true,
      message: "already saved this store",
      savedStores,
    });
  }
});
const deleteAsavedStore = CatchAsync(async (req, res) => {
  const { storeID } = req.params;
  const userID = req.user._id;
  const deletedSavedStore = await SavedStore.findOneAndDelete({
    shop: storeID,
    user: userID,
  });
  if (!deletedSavedStore)
    return res.status(404).json({
      error: true,
      message: "you cannot delete shop you've not saved",
    });
  return res.status(204).json({
    error: false,
    message: "saved shop deleted",
    deletedSavedStore,
  });
});

module.exports = { saveAStore, getSavedStores, deleteAsavedStore };
