const express = require("express");
const { callback, auth } = require("../controller/authController");
const router = express.Router();


router.get("/auth", auth);

router.get("/callback", callback);

module.exports = router;
