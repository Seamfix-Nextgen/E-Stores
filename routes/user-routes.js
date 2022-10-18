const express = require("express");
const{
    signIn,
    signUp,
    forgotPassword,
    resetPassword,
    updatePassword,
    protect,
    restrictTo,
}= ("../controllers/auth-controllers");

const{
    deleteUser,
    updateUser,
    getOneUser,
    getAllUser,
} = ("../controllers/user-controllers");
const router = express.Router();

router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.get("/", protect, restrictTo("admin"), getAllUser);
router.route("/:id").delete(protect, deleteUser)
  .patch(protect, updateUser).get(protect, getOneUser);
  router.post("/forgot-password", forgotPassword);
  router.patch("/reset-password/:token", resetPassword);
  router.patch("/update-password/:id", protect, updatePassword);
module.exports = router;