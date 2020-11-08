const express = require("express");
const router = express.Router();
const UserModel = require("../models/User.model");
const { isLoggedIn } = require("../helpers/auth-helper");
const { response } = require("express");

router.patch("/profile/edit", isLoggedIn, (req, res) => {
    let id = req.body._id;
    const {image, bio, platforms, games} = req.body
    console.log(req.body)
    UserModel.findByIdAndUpdate(id, {
        $set: {
            image: image,
            bio: bio,
            platforms: platforms,
            games: games,
        }
    })
        .then((response) => {
            console.log(response);
            res.status(200).json(response);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                errorMessage: "Something went wrong",
                message: err
            })
        })
})

module.exports = router;
