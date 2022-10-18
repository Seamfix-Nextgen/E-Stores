const { default: mongoose } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "A user must have a name"],
    },
    email: {
      type: String,
      required: [true, "A user must have an email"],
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "A user must have an password"],
      select: false,
      minLength: [8, "Password must ba at least 8 characters"],
      validate: {
        validator: function (val) {
          return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])[A-Za-z\d]{8,}/.test(val);
        },
        message:
          "Password must contain at least a number, a lowercase and an uppercase alphabeth",
      },
    },
    passwordConfirm: {
      type: String,
      required: [true, "A user must have an passwordConfirm"],
      select: false,
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Password and confirm password are different",
      },
     
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    passwordResetToken: String,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordTokenExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

