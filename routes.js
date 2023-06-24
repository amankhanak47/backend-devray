const express = require("express");
const UserCollection = require("./Models/User");
const CenterCollection = require("./Models/Centers.js");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "qwertyuiop";

// user Signup route
router.post(
  "/signup",
  [
    body("email"),
    body("name"),
    body("password"),
  ],
  async (req, res) => {
   
    try {
      //check email already exist or not
      let user = await UserCollection.findOne({ email: req.body.email });
      let sucess = false;
      if (user) {
        console.log(user)
        return res.status(400).json({
          sucess: sucess,
          errors: "sorry a user with this email already exist",
        });
      }

      //create new user
      user = await UserCollection.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        treasure: false
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      sucess = true;
      res.json({ sucess, authtoken });
    } catch (error) {
      console.log(error)
      return res.status(500).json({
          sucess: false,
          errors: error
        });
    }
  }
);



//user login ROUte 
router.post(
  "/login",
  [
    body("password"),
    body("email"),
  ],
  async (req, res) => {
    let sucess = false;   
    const { email, password } = req.body;
    try {
      //check wether user is there or not
      let user = await UserCollection.findOne({ email });
      if (!user) {
        sucess = false;
        return res
          .status(400)
          .json({ sucess: sucess, errors: "eamil id is not registered" });
      }
      if (user.password != password) {
        console.log(password,user.password)
        sucess = false;
        return res
          .status(400)
          .json({ sucess: sucess, errors: "incorrect password" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      sucess = true;

      res.json({ sucess, authtoken });
    } catch (error) {
      console.log(error)
      res.status(500).send({sucess:false,errors:"internal server error occured"});
    }
  }
);

router.post("/bookslot",  body("name"),async (req, res) => {
  try {
   let center = await CenterCollection.findOne({ name:req.body.name });
    center.slot = center.slot-1;
    await center.save()
    res.json({sucess:true, center });
  }
  catch (error) {
    console.log(error)
  }
})


router.post(
  "/addcenter",
  [
    body("name"),
    body("address"),
    body("contact"),
    body("slot"),
    body("date")
  ],
  async (req, res) => {
   
    try {
      //check email already exist or not
     
      center = await CenterCollection.create({
        name: req.body.name,
        address: req.body.address,
        contact: req.body.contact,
        slot: req.body.slot,
        date:req.body.date
      });

     res.json("added");
    } catch (error) {
      console.log(error)
      return res.status(500).json({
          sucess: false,
          errors: error
        });
    }
  }
);


// update treasure route
router.post("/editcenter",  [
    body("name"),
    body("address"),
    body("contact"),
    body("slot"),
  ],async (req, res) => {
  try {
   let center = await CenterCollection.findOne({ name:req.body.name });
      center.name = req.body.name,
      center.address = res.body.address,
      center.contact = req.body.contact,
      center.slot=req.body.slot,
    await center.save()
    res.json(center);
  }
  catch (error) {
    console.log(error)
  }
})


router.post("/deletecenter",  [
body("name")
  ],async (req, res) => {
  try {
   let center = await CenterCollection.deleteOne({ name:req.body.name });
     
    res.json("deleted");
  }
  catch (error) {
    console.log(error)
  }
})

//get all  leaderboard
router.post(
  "/getallcenter",
  async (req, res) => {
    try {
      const users=await CenterCollection.find()
      res.json(users);
    } catch (error) {
      res.status(500).send("some error occured");
    }
  }
);

router.post(
  "/get_loc_center",body("address"),
  async (req, res) => {
    try {
      const users = await CenterCollection.find({ address: req.body.address })
      res.json(users);
    } catch (error) {
      res.status(500).send("some error occured");
    }
  }
);


// const fetchuser = (req, res, next) => {
//   //get user from the jwt token and add to req object
//   const token = req.header("auth-token");
//   if (!token) {
//     res.status(401).send({ error: "please authenticate using a valid token" });
//   }
//   try {
//     const data = jwt.verify(token, JWT_SECRET);
//     req.user = data.user;
//     next();
//   } catch (error) {
//     res.status(401).send({ error: "dont know" });
//   }
// };

//get user data route
// router.post("/getuser", fetchuser, async (req, res) => {
//   try {
//     let userId = req.user.id;
  

//     const user = await UserCollection.findById(userId).select(
//       "-password"
//     );
//     res.send(user);
//   } catch (error) {
//     res.status(500).send("internal server error occured");
//   }
// });

module.exports = router;