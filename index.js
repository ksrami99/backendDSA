const express = require("express");
const cors = require("cors");
const serverless = require('serverless-http');
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// Routes Imports
const authRoute = require("./routes/authRoutes");
const profileRoute = require("./routes/profileRoutes");
const timesheetRoute = require("./routes/timesheetRoute");
const projectsRoute =require("./routes/projectRoutes");
const checkInsRoute = require("./routes/checkinRoutes")

// Middleware
app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use("/", authRoute);
app.use("/", profileRoute);
app.use("/", timesheetRoute);
app.use("/", projectsRoute);
app.use("/", checkInsRoute);
// app.use('/admin', adminRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 

