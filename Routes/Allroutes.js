const express = require("express");
const userRouter = express.Router();
// for hashing
const bcrypt = require("bcrypt");
const { userModel } = require("../Module/Authmodule");
//import json web token
const jwt = require("jsonwebtoken");

userRouter.get("/", (req, res) => {
  res.send("<h1>WelCome</h1>");
});
// this is for get users

userRouter.get("/users", async(req, res) => {
  try{

    const getusers = await userModel.find();
          res.send(getusers);

  }catch(er){
    res.status(400).send({ message: err.message });

  }
 
});
// this is for signup the user
userRouter.post("/signup", async (req, res) => {
  const { email, password ,name } = req.body;
  const ip = req.ip;
  const time =new Date();
 
  try {
    const userPresent = await userModel.findOne({ email });
    if (userPresent) {
      res.send("Already registered");
    } else {
      bcrypt.hash(password, 5, async function (err, hash) {
        const userDetails = new userModel({ name,email, password: hash, ip:ip, time:time });
        await userDetails.save();

        console.log("data is added");
        res.send("signup successful");
      });
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
    console.log("data adding failed");
  }
});
// this is for login the user
userRouter.post("/login", async (req, res) => {
  const { name,email, password } = req.body;
  try {
    const user = await userModel.find({ email });
    const hashed_password = user[0].password;

    if (user.length > 0) {
      bcrypt.compare(password, hashed_password, function (err, result) {
        // result == true
        if (result) {
          const token = jwt.sign({ userId: user[0]._id }, "shhh", {
            expiresIn: "24h",
          });
          res.send({ message: "login successful ", token: `${token}`,email:`${email}`,name:`${user.name}` });
        } else {
          res.send("login failed");
        }
      });
    } else {
      res.send("login failed");
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
    console.log("data adding failed");
  }
});

module.exports = { userRouter };