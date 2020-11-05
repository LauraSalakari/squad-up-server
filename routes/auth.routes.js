const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const UserModel = require("../models/User.model");
const { isLoggedIn } = require("../helpers/auth-helper");


// post signup
router.post("/signup", (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    console.log(req.body)

    if (!username || !email || !password) {
        res.status(500)
            .json({
                errorMessage: 'Please enter a username, email and password'
            });
        return;
    }

    if (password !== confirmPassword) {
        res.status(500)
            .json({
                errorMessage: 'Passwords do not match!'
            });
        return;
    }

    const myRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
    if (!myRegex.test(email)) {
        res.status(500)
            .json({
                errorMessage: 'Email format is not recognised.'
            });
        return;
    }

    const myPassRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);
    if (!myPassRegex.test(password)) {
        res.status(500)
            .json({
                errorMessage: 'Password must have at least 8 characters and one uppercase, lowercase and special character.'
            });
        return;
    }

    bcrypt.genSalt(12)
        .then((salt) => {
            bcrypt.hash(password, salt)
                .then((passwordHash) => {
                    UserModel.create({ email, username, passwordHash })
                        .then((user) => {
                            user.passwordHash = "*****"
                            req.session.loggedInUser = user;
                            console.log(req.session);
                            res.status(200).json(user);
                        })
                        .catch((err) => {
                            if (err.code === 11000) {
                                res.status(500)
                                    .json({
                                        errorMessage: 'Provided username or email already exists.'
                                    });
                                return;
                            }
                            else {
                                res.status(500)
                                    .json({
                                        errorMessage: 'Something went wrong! Please try again later.'
                                    });
                                return;
                            }
                        })
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
})


// post signin
router.post("/signin", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(500).json({
            errorMessage: "Please enter your username and password."
        })
        return;
    }

    const myRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
    if (!myRegex.test(email)) {
        res.status(500).json({
            errorMessage: "Invalid email format."
        })
        return;
    }

    UserModel.findOne({ email })
        .then((data) => {
            bcrypt.compare(password, data.passwordHash)
                .then((match) => {
                    if (match) {
                        data.passwordHash = "***";
                        req.session.loggedInUser = data;
                        console.log('Signin', req.session)
                        res.status(200).json(data)
                    }
                    else {
                        res.status(500).json({
                            errorMessage: "Incorrect password"
                        })
                        return;
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch(() => {
            res.status(500).json({
                errorMessage: "Email address not recognised"
            })
            return;
        })
})


// post logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res
    .status(204)
    .send();
})


// get user
router.get("/user", isLoggedIn, (req, res, next) => {
    res.status(200).json(req.session.loggedInUser);
});

module.exports = router;