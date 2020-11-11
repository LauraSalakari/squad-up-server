require('dotenv').config();

const express = require("express");
const router = express.Router();
const axios = require("axios");
const { isLoggedIn } = require('../helpers/auth-helper');
const SquadModel = require("../models/Squad.model");

//post squad - create
router.post("/squads/create", isLoggedIn, (req, res) => {
    const {title, description, game, maxSize, creator, members} = req.body;

    SquadModel.create({title, description, game, maxSize, creator, members})
    .then((data) => {
        res.status(200).json(data)
    })
    .catch((err) => {
        res.status(500).json({
            errorMessage: "Failed to create squad"
        })
    })
})

//get squads - get list
router.get("/squads", isLoggedIn, (req,res) => {
    SquadModel.find()
    .populate("creator")
    .then((data) => {
        res.status(200).json(data)
    })
    .catch((err) => {
        res.status(500).json({
            errorMessage: "Failed to fetch squads"
        })
    })
})

//patch join - add a member to a squad
router.patch("/squads/:id/join", isLoggedIn, (req, res) => {
    let squadId = req.params.id;
    let {userId} = req.body;

    SquadModel.findById(squadId)
    .then((squad) => {
        console.log("here")
        let newMembers = [...squad.members, userId];
        SquadModel.findByIdAndUpdate(squadId, {$set: {members: newMembers}})
        .populate("creator")
        .populate("members")
        .then((updated) => {
            console.log(updated)
            res.status(200).json(updated);
        })
    })
})

//patch leave - a member leaves squad
router.patch("/squads/:id/leave", isLoggedIn, (req, res) => {
    let squadId = req.params.id;
    let {userId} = req.body;

    SquadModel.findById(squadId)
    .then((squad) => {
        let newMembers = squad.members.filter(e => e != userId);
        SquadModel.findByIdAndUpdate(squadId, {$set: {members: newMembers}})
        .populate("creator")
        .populate("members")
        .then((updated) => {
            console.log(updated);
            res.status(200).json(updated);
        })
    })
})

//patch squad - edit squad details
router.patch("/squads/:id/edit", isLoggedIn, (req, res) => {
    const {title, description, maxSize, game} = req.body;
    
    SquadModel.findByIdAndUpdate(req.params.id, {$set: {title: title, description: description, maxSize: maxSize, game: game}})
    .then((data) => {
        console.log(data);
        res.status(200).json(data);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            errorMessage: "failed to update squad!"
        })
    })
})

//get squad/:id - get squad details
router.get("/squads/:id", isLoggedIn, (req, res) => {
    let id = req.params.id

    SquadModel.findById(id)
    .populate("creator")
    .populate("members")
    .then((squad) => {
        res.status(200).json(squad);
    })
    .catch((err) => {
        res.status(500).json({
            errorMessage: "Failed to fetch squad details"
        })
    })
})

//delete squad - delete a squad
router.delete("/squads/:id/delete", isLoggedIn, (req, res) => {
    SquadModel.findByIdAndDelete(req.params.id)
    .then((response) => {
        res.status(200).json(response)
    })
})

module.exports = router;