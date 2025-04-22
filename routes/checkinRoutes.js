const express = require("express");
const { getQuestionaries } = require("../controller/checkinController")
const router = express.Router();

router.get("/checkins/:projectsId/:questionnaireId", getQuestionaries);

module.exports = router;
