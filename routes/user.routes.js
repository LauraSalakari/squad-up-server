const express = require("express");
const router = express.Router();
const UserModel = require("../models/User.model");
const SquadModel = require("../models/Squad.model")
const { isLoggedIn } = require("../helpers/auth-helper");
const bcrypt = require("bcryptjs");

router.patch("/profile/edit", isLoggedIn, (req, res) => {
    let id = req.body._id;
    const { image, bio, platforms, games } = req.body;
    UserModel.findByIdAndUpdate(id, {
        $set: {
            image: image,
            bio: bio,
            platforms: platforms,
            games: games,
        }
    })
        .then((response) => {
            response.passwordHash = "***";
            req.session.loggedInUser = response;
            console.log('Signin', req.session)
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

router.patch("/profile/password", isLoggedIn, (req, res) => {
    const { password, newPassword, confirmPassword, id } = req.body;

    if (newPassword !== confirmPassword) {
        res.status(500).json({
            errorMessage: "New and confirmed password do not match"
        })
    }

    const myPassRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);
    if (!myPassRegex.test(newPassword)) {
        res.status(500)
            .json({
                errorMessage: 'Password must have at least 8 characters and one uppercase, lowercase and special character.'
            });
        return;
    }

    UserModel.findById(id)
        .then((data) => {
            bcrypt.compare(password, data.passwordHash)
                .then((match) => {
                    if (match) {
                        bcrypt.genSalt(12)
                            .then((salt) => {
                                bcrypt.hash(newPassword, salt)
                                    .then((passwordHash) => {
                                        UserModel.findByIdAndUpdate(id, { $set: { passwordHash: passwordHash } })
                                            .then((user) => {
                                                user.passwordHash = "*****"
                                                req.session.loggedInUser = user;
                                                console.log(req.session);
                                                res.status(200).json(user);
                                            })
                                            .catch((err) => {
                                                res.status(500).json({
                                                    errorMessage: "Failed to update password"
                                                })
                                            })
                                    })
                                    .catch((err) => {
                                        res.status(500).json({
                                            errorMessage: "Failed to hash new password"
                                        })
                                    })
                            })
                            .catch((err) => {
                                res.status(500).json({
                                    errorMessage: "Failed to generate salt for new password"
                                })
                            })
                    }
                    else {
                        res.status(500).json({
                            errorMessage: "Incorrect password"
                        })
                        return;
                    }
                })
                .catch((err) => {
                    res.status(500).json({
                        errorMessage: "Could not validate password"
                    })
                })
        })
        .catch((err) => {
            res.status(500).json({
                errorMessage: "User not found"
            })
        })
})

router.get("/profile/:id", isLoggedIn, (req, res) => {
    console.log("profile details requested")
    UserModel.findById(req.params.id)
        .then((response) => {
            console.log("user details: ", response)
            res.status(200).json(response)
        })
        .catch((err) => {
            res.status(500).json({
                errorMessage: "Something went wrong"
            })
        })
})

// get squads
router.get("/profile/:id/squads", isLoggedIn, (req,res) => {
    let id = req.params.id;
    SquadModel.find({members: id})
    .populate("creator")
    .then((squads) => {
        res.status(200).json(squads);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            errorMessage: "Failed to fetch user squads"
        })
    })
})

module.exports = router;
