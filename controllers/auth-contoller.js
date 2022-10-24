const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const CatchAsync = require("../utils/catch-async");
const User = require("../models/User");
const User = require("../models/User");
const ErrorObject = require("../utils/error");

const { JWT_EXPIRES_IN, JWT_SECRET, JWT_COOKIE_EXPIRES_IN, NODE_ENV } =
  process.env;

const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const creatAndSendToken = CatchAsync(async (user, statusCode, res) => {
  const token = await signToken(user._id);
  const cookieoptions = {
    exprires: new Date(
      Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

// sign up user
exports.signUp = CatchAsync(async(req,res, next)=>{
  const { email, fullName, password, confirmPassword, role} = req.body;
  const user = await User.create({
    email,
    fullName,
    password,
    confirmPassword,
    role,
});
  createAndSendTokenuser(user, 201, res);
});



//signIn user
exports.signIn = CatchAsync(async(req,res,next)=>{
  const {email, passWord} = req.body;
  if(!email || !passWord) {
    return next(
      new ErrorObject("please enter an email and a password", 401));
  }
const user = await User.findOne({email}).select ("+password")
const confirmPassword = await bcrypt.compare(passWord, user.password)
if(!confirmPassword||!user){
  return next(
    new ErrorObject("invalid email or password", 401));
}
createAndSendToken(user, 200, res);
})
