const axios = require("axios");
require("dotenv").config();

// AuthConfig
const authConfig = {
  clientId: process.env.BASECAMP_CLIENT_ID,
  clientSecret: process.env.BASECAMP_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
  authorizationBaseUrl: "https://launchpad.37signals.com/authorization/new",
  tokenUrl: "https://launchpad.37signals.com/authorization/token",
};

const auth = (req, res) => {
  res.redirect(
    "https://launchpad.37signals.com/authorization/new?client_id=a7a504f4ab3d434a56c58b3a0fef6a27c638b750&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&type=web_server"
  );
};

const callback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Authorization code is missing.");
  }

  try {
    const tokenResponse = await axios.post(authConfig.tokenUrl, {
      client_id: authConfig.clientId,
      client_secret: authConfig.clientSecret,
      code: code,
      redirect_uri: authConfig.redirectUri,
      type: "web_server",
    });

    const tokens = tokenResponse.data;

    const headers = {
      'Authorization': `Bearer ${tokens.access_token}`,
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


    // Redirect to the frontend dashboard with the token as a URL parameter
    res.redirect(`http://localhost:4000/loading?token=${tokens.access_token}&userId=${user.data.id}`);

  } catch (error) {
    console.log("Error during OAuth callback:", error);
    res.redirect(`http://localhost:4000/?error=${encodeURIComponent(error.message)}`);
  }
};

module.exports = {  auth, callback };
