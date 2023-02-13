const express = require("express");
const { default: mongoose } = require("mongoose");

const registerSchema = new mongoose.Schema({
        firstname : {
            type:String,
            required:true
        },
        email : {
            type:String,
            required:true,
            unique:true
        },
        password: {
            type:String,
            required:true
        },
        confirmpassword: {
            type:String,
            required:true
        },
        phone:{
            type:Number,
            required:true
        },
        gender: {
            type:String,
            requried: true
        }
})


const Register = new mongoose.model("Register", registerSchema);
module.exports = Register;