const express = require("express");
const { getTimesheet } = require("../controller/timesheetController");
// const { getFile } = require("../controller/dailySheetController");

const router = express.Router();

// http://localhost:3000/projects/timesheets/47483552/2025-02-16/2025-02-17
router.get("/projects/timesheets/:startDate/:endDate", getTimesheet);
// router.get("/files", getFile); 

module.exports = router;
