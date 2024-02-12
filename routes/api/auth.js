const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const User = require("../../modules/User");
const {body, validationResult} = require("express-validator");

//@route   GET api/auth
//@desc    Test route
//@access  Public

//note: pass auth as the second argument

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); //select everything else minus password
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({msg: "Server error"});
  }
});

router.post(
  "/",
  [
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({erors: errors.array()});
    }

    const {email, password} = req.body;

    try {
      //registering the user

      //see if they exist
      //making query with mongoose
      let user = await User.findOne({email});

      //if user doesnt exist
      if (!user) {
        return res.status(400).json({errors: [{msg: "Innvalid Credentials"}]});
      }

      //if they do, store password in object and compare
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({errors: [{msg: "Innvalid Credentials"}]});
      }

      //return json web token
      //1. create payload
      const payload = {
        user: {
          id: user.id,
          name: user.name,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtToken"),
        {expiresIn: 36000},
        (err, token) => {
          if (err) throw err;
          res.json({token});
        }
      ); //takes in payload and jwt secret

      // res.send("User registered");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
