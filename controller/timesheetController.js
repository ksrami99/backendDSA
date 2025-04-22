const axios = require("axios");
const fs = require("fs");
const path = require("path");

const getTimesheet = async (req, res) => {
  const access_token = req.headers.authorization;
  const personId = req.query.userId || '';
  const projectId = req.query.projectId || '';
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  try {
    const headers = {
      'Authorization': `Bearer ${access_token}`,
    };

    const accountsResponse = await axios.get(
      "https://launchpad.37signals.com/authorization.json",
      { headers }
    );
    const accounts = accountsResponse.data.accounts;

    const basecampAccount = accounts.find((acc) => acc.product === "bc3");
    if (!basecampAccount) {
      return res.status(404).json({ error: "No Basecamp 3 account found" });
    }

    const accountUrl = basecampAccount.href;
    const projectUrl = `${accountUrl}/reports/timesheet.csv?person_id=${personId}&bucket_id=${projectId}&start_date=${startDate}&end_date=${endDate}`;

    const projectResponse = await axios.get(projectUrl, {
      headers,
      responseType: "stream",
    });

    const filePath = path.join(__dirname, "..", "..", "public", "timesheet.csv");
    // const filePath = path.join(__dirname, "timesheet.csv");

    const writer = fs.createWriteStream(filePath);
    projectResponse.data.pipe(writer);

    writer.on("finish", () => {
      res.status(200).json({ message: "File saved successfully." });
    });

    writer.on("error", (err) => {
      console.error("Error saving file:", err);
      res.status(500).json({ error: "Failed to save CSV file." });
    });
  } catch (error) {
    console.log(`Error fetching timesheet: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTimesheet };
