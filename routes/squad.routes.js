require('dotenv').config();

const express = require("express");
const router = express.Router();
const axios = require("axios");
const { isLoggedIn } = require('../helpers/auth-helper');
const SquadModel = require("../models/Squad.model");

//post squad - create
router.post("/squads/create", isLoggedIn, (req, res) => {
    console.log(req.body)
    res.status(200).json("received")

    // SquadModel.create({})
    // .then((data) => {
    //     res.status(200).json(data)
    // })
    // .catch((err) => {
    //     res.status(500).json({
    //         errorMessage: "Failed to create squad"
    //     })
    // })
})

//get squads - get list
router.get("/squads", isLoggedIn, (req,res) => {

})

//patch squad - edit squad details
router.patch("/squads/edit/:id", isLoggedIn, (req, res) => {

})

//get squad/:id - get squad details
router.get("/squads/:id", isLoggedIn, (req, res) => {

})

//delete squad - delete a squad
router.delete("/squads/:id", isLoggedIn, (req, res) => {

})

module.exports = router;