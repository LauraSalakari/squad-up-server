const { json } = require('express');
const express = require('express');
const router  = express.Router();
const { isLoggedIn } = require("../helpers/auth-helper");
const PostModel = require("../models/Post.model");
const CommentModel = require("../models/Comment.model");

// get all posts
router.get("/forums", isLoggedIn, (req, res) => {
    PostModel.find()
    .populate("author")
    .then((threads) => {
        res.status(200).json(threads);
    })
    .catch((err) => {
        console.log(err)
        res.status(500).json({
            errorMessage: "Failed to fetch posts"
        })
    })
})


// get post details
router.get("/forums/:id", isLoggedIn, (req, res) => {
    PostModel.findById(req.params.id)
    .populate("author")
    .then((post) => {
        console.log(post)
        res.status(200).json(post);
    })
    .catch((err) => {
        console.log(err),
        res.status(500).json({
            errorMessage: "Failed to fetch thread"
        })
    })
})

// create a post
router.post("/forums/new", isLoggedIn, (req, res) => {
    const {author, title, content} = req.body;

    if(!title || !content){
        res.status(500).json({
            errorMessage: "Please give your post a title and some content!"
        })
        return;
    }

    PostModel.create({author, title, content, upvotes: 0})
    .then((data) => {
        res.status(200).json(data)
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            errorMessage: "Failed to create post"
        })
    })
})

// create a comment - needs second model!


// edit a post


// delete a post


module.exports = router;