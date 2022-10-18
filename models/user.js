const mongoose = require ("mongoose");
const express = require("express");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const crypto = require ("crypto");
const { stringify } = require("querystring");

const userSchema = new mongoose.schema({

fullName: {
    type: stringify,
    required:[true, "customer should have a name"],
},

email:{
type: stringify,
required:[true, "An email is required"],
unique: true,
validate: [validator.isEmail, "kindly enter a valid email"],
},

password:{
    type: string,
    required:[true, "user must have a password"],
    select: false,
    minLength:[8, "password should not exceed 8 characters"],
    validate:{
        validator: function (val){
return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])[A-Za-z\d]{8,}/.test(val);
},
        message:
        "Password must contain at least a number, a lowercase and an uppercase alphabeth",
    },
},

passwordConfirm:{
    type: string,
    required:[true, "user must have a comfirm password"],
    select: false,
    minLength:[8, "password should not exceed 8 characters"],
    validate:{
        validator: function (val){
            return val===this.password;
},
message:"password and confirm password are different"
    },

    role:{
    type: string,
    default: "user",
    enum:["user", "admin"],
    },


passwordResetToken: String,
passwordChangedAt: Date,
passwordResetToken: String,
passwordTokenExpires: Date,

active:{
    type: Boolean,
    default: true,
    select:false,
},
},

{ toObject:{virtuals:true}, toJSON:{virtuals:true} }
);

