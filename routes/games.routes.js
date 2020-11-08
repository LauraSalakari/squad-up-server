require('dotenv').config();

const express = require("express");
const router = express.Router();
const axios = require("axios")

router.get("/platforms", (req, res) => {
    axios.get(`https://api.rawg.io/api/platforms/lists/parents`)
    .then((response) => {
        res.status(200).json(response.data.results);
    })
    .catch(()=> {
        res.status(500).json({
            errorMessage: "Failed to retrieve platforms"
        })
    })
})

module.exports = router;