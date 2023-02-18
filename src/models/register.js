const express = require("express");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const async = require("hbs/lib/async");
const jwt = require("jsonwebtoken");

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
        },
        tokens : [{
            token:{
                type:String,
                requried: true
            }
        }]
})

//generating tokens
registerSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECERT_KEY);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        console.log(token);
        return token;
    }catch(error){
        res.send("the error part" + error);
        console.log("the error part" + error);
    }
}





//hashing middleware
registerSchema.pre("save", async function(next){
  
    if(this.isModified("password")){
        // console.log(`before ${this.password}`);
        //  const passwordhash = await bcrypt.hash(password, 10);
            this.password = await bcrypt.hash(this.password, 10);
            this.confirmpassword = await bcrypt.hash(this.password, 10);
            // console.log(`after ${this.password}`);
            
            // this.confirmpassword = undefined;
    }
    next();
})


const Register = new mongoose.model("Register", registerSchema);
module.exports = Register;