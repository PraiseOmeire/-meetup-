const express = require("express");

const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const {body, validationResult} = require("express-validator");

//bring in user module
const User = require("../../model/User");

//@route   POST api/users
//@desc    Register User
//@access  Public

router.post(
  "/",
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password should not be less than 8 chars").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    //errors.isEmpty(): This is a method provided by the express-validator library. It returns true if there are no validation errors, and false if there are errors.

    if (!errors.isEmpty()) {
      return res.status(400).json({erors: errors.array()});
    }

    const {name, email, password} = req.body;

    try {
      //registering the user

      //see if they exist
      //making query with mongoose
      let user = await User.findOne({email});

      //if yes, send an error

      if (user) {
        return res.status(400).json({errors: [{msg: "User already exists"}]});
      }
      //get users gravatar based on email : runs if user is not found

      const avatar = gravatar.url(email, {
        //size
        s: "200",
        //rating
        r: "pg",
        //default
        d: "mm", //gives default image : icon
      });

      //create an instance of a user
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //encript password using bcript
      //first create salt to do hashing
      const salt = await bcrypt.genSalt(10);
      //next: hash the password
      user.password = await bcrypt.hash(password, salt);
      //save user to database
      await user.save();

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
