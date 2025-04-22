const axios = require("axios");

const getProjects = async (req, res) => {
    const access_token = req.headers.authorization;

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
    const projectsResponse = await axios.get(`${accountUrl}/projects.json`, {
      headers,
    });
    const projects = projectsResponse.data;
    res.json(projects);
  } catch (error) {
    console.log("Error fetching projects:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProjects };
