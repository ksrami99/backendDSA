const axios = require("axios");

const getQuestionaries = async (req, res) => {
  const { projectsId, questionnaireId } = req.params;
  const access_token = req.headers.authorization;

  try {
    const headers = {
      Authorization: `Bearer ${access_token}`,
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
    const questionId = await axios.get(
      `${accountUrl}/buckets/${projectsId}/questionnaires/${questionnaireId}/questions.json`,
      { headers }
    );
    const checkins = questionId.data[0].id;

    let mergedData = [];

    // Fetch pages 1 to 4 and merge results
    for (let page = 1; page <= 4; page++) {
      try {
        const response = await axios.get(
          `${accountUrl}/buckets/${projectsId}/questions/${checkins}/answers.json?page=${page}`,
          { headers }
        );

        if (Array.isArray(response.data)) {
          mergedData = mergedData.concat(response.data);
        }
      } catch (err) {
        console.log(`Error fetching page ${page}:`, err.message);
      }
    }

    res.json(mergedData);
  } catch (error) {
    console.log(`Error fetching question ID: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};


module.exports = { getQuestionaries };
