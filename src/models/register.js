const express = require("express");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

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

//hashing middleware
registerSchema.pre("save", async function(next){
  
    if(this.isModified("password")){
        console.log(`before ${this.password}`);
        //  const passwordhash = await bcrypt.hash(password, 10);
            this.password = await bcrypt.hash(this.password, 10);
            console.log(`after ${this.password}`);
            
            this.confirmpassword = undefined;
    }
    next();
})


const Register = new mongoose.model("Register", registerSchema);
module.exports = Register;