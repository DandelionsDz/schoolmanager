const express = require("express");
const { getJsonResponeFromPayload } = require("../utils/ai.utils");
const { AI_SERVER_VN, AI_SERVER_GLOBAL } = require("../consts/ai_server");
const herc = require("../services/hercai_ai");
const router = express.Router();

router.get("/", async (req, res) => {
    let prompt = req.query.prompt;

    try {
        let answer = (
            await herc.question({ model: "v3-beta", content: prompt })
        ).reply;
        let respone = { from: "herc-gpt4", answer: answer };
        res.send(respone);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
