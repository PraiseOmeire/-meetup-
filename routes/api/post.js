const express = require("express");
const router = express.Router();
const {body, validationResult} = require("express-validator");
const auth = require("../../middleware/auth");

const Post = require("../../model/Post");
const Profile = require("../../model/Profile");
const User = require("../../model/User");

//@route   POST  api/post
//@desc    Create post
//@access  Public

router.post(
  "/",
  [auth, [body("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();

      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({msg: "Server Error "});
    }
  }
);

//@route   Get  api/post
//@desc    Get all posts
//@access  Private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({date: -1});
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({msg: "server error"});
  }
});

//@route   Get  api/post/:id
//@desc    Tget post by id
//@access  Private

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({msg: "Post not found"});
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    if (error.name == "CastError") {
      res.status(400).json({msg: "User Profile does not exist"});
    }
    res.status(500).json({msg: "server error"});
  }
});

//@route   Delete api/post
//@desc    Get all posts
//@access  Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if user deleting is the owner of the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({msg: "User not authorized"});
    }

    await post.deleteOne();
    res.json({msg: "Post removed"});
  } catch (error) {
    console.error(error.message);
    if (error.name == "CastError") {
      res.status(404).json({msg: "Post not found"});
    }
    res.status(500).json({msg: "server error"});
  }
});

//@route   PUT api/posts/like/:id
//@desc    Like a post
//@access  Private

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if post has already being liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status.json({msg: "Post already liked"});
    }

    post.likes.unshift({user: req.user.id});

    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//@route   PUT api/posts/like/:id
//@desc    Unlike a post
//@access  Private

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if post has already being liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status.json({msg: "Post has not yet being liked"});
    }

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//@route   POST  api/post/comment/:id
//@desc    comment on post
//@access  Public

router.post(
  "/comment/:id",
  [auth, [body("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({msg: "Server Error "});
    }
  }
);

//@route  DELETE api/post/comment/:id/:comment_id
//@desc    comment on post
//@access  Public

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    //make sure comment exists
    if (!comment) {
      return res.status(404).json({msg: "comment does not exist"});
    }

    //check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({msg: "This post cannot be deleted by you"});
    }

    //Get remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({msg: "Server Error "});
  }
});

module.exports = router;
