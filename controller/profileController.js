const axios = require("axios");

const getProfile = async (req, res) => {
  const access_token = req.headers.authorization;
  
  try {
    const headers = {
      'Authorization': `Bearer ${access_token}`,
    };

    const profileResponse = await axios.get(
      "https://launchpad.37signals.com/authorization.json",
      { headers }
    );

    const accounts = profileResponse.data.accounts;

    const basecampAccount = accounts.find((acc) => acc.product === "bc3");
    if (!basecampAccount) {
      return res.status(404).json({ error: "No Basecamp 3 account found" });
    }

    const accountUrl = basecampAccount.href;
    const user = await axios.get(`${accountUrl}/my/profile.json`, { headers });

    const userProfile = {
      id: user.data.id,
      email: user.data.email_address,
      name: user.data.name,
    };

    res.status(200).json(userProfile);
  } catch (error) {
    console.log(`Error fetching profile: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProfile };
