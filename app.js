require('dotenv').config()
const express = require("express");
const async = require("hbs/lib/async");
const app = express();
const port = process.env.PORT || 3000;
require("./src/db/connection");
const path = require("path");
const register = require("./src/models/register"); 
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false})); 

//requiring html content from public folder
app.get('/', async (req, res) => {
    res.send("Hello From Website");
  });

app.get('/secret', async (req, res) => {
    console.log(`get cookies ${req.cookies.jwt}`);
    res.send("secret");
});  


app.post("/register", async(req, res) => {
    try{
        const password =  req.body.password;
        const cpassword =  req.body.confirmpassword;
      
        if(password === cpassword){

            const registerEmployess = new register({
                firstname: req.body.firstname,
                email: req.body.email,
                password:password,
                confirmpassword:cpassword,
                phone: req.body.phone,
                gender: req.body.gender
            }) 

            //jwt token
              console.log("the Success Part" + registerEmployess);
              const token = await registerEmployess.generateAuthToken();
              console.log("the token part" + token);

              //cookie part
              res.cookie("jwt", token,{
                expires:new Date(Date.now()+ 500000),
                httpOnly:true
              });
              // console.log(cookie);



          //pwd hashing
           const registered = await registerEmployess.save();
          // res.status(201).render("index");
          // res.status(201).send(registered);
          res.sendFile(__dirname + '/public/welcome.html');
        }else{
            res.send("passwords are not matching");
        }

    }catch(err){
        res.status(400).send(err);
    }
  });


  
app.get('/register', async(req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });

  app.get('/login', async(req, res) => {
    res.sendFile(__dirname + '/public/login.html');
  });

  //login check
  app.post("/login", async(req,res) =>{
    try{
      const email = req.body.email;
      const password = req.body.password;
      // console.log(email);
      // console.log(password);

      const useremail = await register.findOne({email:email});

      //bcypt will check pwd is right or wrong
      const isMatch = await bcrypt.compare(password, useremail.password);
      
      //middleware JWT token
      const token = await useremail.generateAuthToken();
      console.log("the token part" + token);

      //cookie part
      res.cookie("jwt", token,{
        expires:new Date(Date.now()+ 500000),
        httpOnly:true,
        // secure: true //it will only work on https
      });

    
      

      if(isMatch){
        res.sendFile(__dirname + '/public/welcome.html');
      }else{
        res.send("Details are wrong")
      }

    }catch(err){
      res.status(400).send("Invalid Email");
    }
  })

app.listen(port, () =>{
    console.log(`Server is Running on ${port}`);
});
