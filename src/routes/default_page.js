const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello World!");
});

router.post("/", (req, res) => {
    res.send(req.toArray());
});

module.exports = router;
