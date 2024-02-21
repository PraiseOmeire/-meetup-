const express = require("express");

const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const {body, validationResult} = require("express-validator");
const Profile = require("../../model/Profile");
const User = require("../../model/User");

//@route   GET api/profile/me
//@desc    get currwnt user profile
//@access  Private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id}).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      res.status(400).json({msg: "Profile for this user doesn not exist"});
    }
    res.json(profile);
  } catch (error) {
    console.error("error.message");
    res.status(500).json({msg: "Server error"});
  }
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  "/",
  [
    auth,
    [
      body("status", "Status is required").notEmpty(),
      body("skills", "Skills is required").notEmpty(),
    ],
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    // destructure the request
    const {
      website,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      status,
      company,
      location,
      bio,
      githubusername,
      // spread the rest of the fields we don't need to check
      ...rest
    } = req.body;

    // build a profile
    const profileFields = {
      // user: req.user.id,
      // website:
      //   website && website !== "" ? normalize(website, {forceHttps: true}) : "",
      // skills: Array.isArray(skills)
      //   ? skills
      //   : skills.split(",").map((skill) => " " + skill.trim()),
      // ...rest,
    };

    //build profile object
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());

      console.log(profileFields);

      //build social object
      profileFields.social = {};
      if (youtube) profileFields.social.youtube = youtube;
      if (twitter) profileFields.social.twitter = twitter;
      if (facebook) profileFields.social.facebook = facebook;
      if (linkedin) profileFields.social.linkedin = linkedin;
      if (instagram) profileFields.social.instagram = instagram;

      try {
        let profile = await Profile.findOne({user: req.user.id});

        if (profile) {
          //update
          profile = await Profile.findOneAndUpdate(
            {user: req.user.id},
            {$set: profileFields},
            {new: true}
          );
          return res.json(profile);
        }

        //create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
      } catch (error) {
        console.error(error.message);
        res.status(500).send({msg: "server error"});
      }
    }
  }
);

//@route   GET api/profile
//@desc    all profiles
//@access  Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({msg: "Server error"});
  }
});

//@route   GET api/profile/user/user_id
//@desc    all profiles
//@access  Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.params.user_id}).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      res.status(400).json({msg: "User Profile does not exist"});
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.name == "CastError") {
      res.status(400).json({msg: "User Profile does not exist"});
    }
    res.status(500).send({msg: "Server error"});
  }
});

//@route   Delete api/profile
//@desc    delete profile, user, post
//@access  private

router.delete("/", auth, async (req, res) => {
  try {
    //remove profile
    await Profile.findOneAndDelete({user: req.user.id});

    //remove user
    await User.findOneAndDelete({_id: req.user.id});
    res.json({msg: "User deleted"});
  } catch (error) {
    console.error(error.message);
    res.status(500).send({msg: "Server error"});
  }
});

//@route   GET api/profile
//@desc    all profiles
//@access  Public

router.put(
  "/experience",
  [
    auth,
    [
      body("title", "Title is required").not().isEmpty(),
      body("company", "Company is required").not().isEmpty(),
      body("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {title, company, location, from, to, current, desription} = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      desription,
    };

    try {
      const profile = await Profile.findOne({user: req.user.id});
      profile.experience.unshift(newExp);
      await profile.save();

      res.json(profile);
    } catch (error) {
      console.log(error);
      res.status(500).send({msg: "Server error"});
    }
  }
);
module.exports = router;
