const axios = require("axios");
const { refreshAccessToken } = require("../utils/authUtils");
const { loadTokens, saveTokens } = require("../utils/tokenUtils");

const FCM_URL = `https://fcm.googleapis.com/v1/projects/${process.env.APP_ID_FIRBASE}/messages:send`;

// Token management
let tokens = loadTokens(); // Load tokens initially

// Send push notification using FCM
async function sendNotification(accessToken, token, title, body, data = {}) {
  const payload = {
    message: {
      token: token,
      notification: {
        title: title,
        body: body,
      },
      data: data,
    },
  };

  try {
    const response = await axios.post(FCM_URL, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Notification response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}

// Endpoint to save FCM token from Flutter frontend
const saveToken = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  // Store the token (you might want to save this in a database)
  tokens[token] = { token, expiryTime: Date.now() + 3600 * 1000 }; // Example expiry time
  saveTokens(tokens);

  res.status(200).json({ success: true });
};

// Endpoint to send notifications
const sendNotificationEndpoint = async (req, res) => {
  const { token, title, body, data } = req.body;

  if (!token || !title || !body) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Refresh the access token
    const accessToken = await refreshAccessToken(tokens);

    // Send the notification
    const response = await sendNotification(
      accessToken,
      token, // Use the FCM token received from the Flutter app
      title,
      body,
      data
    );
    res.status(200).json({ success: true, response: response });
  } catch (error) {
    console.error("Error in /send-notification endpoint:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
};

module.exports = {
  saveToken,
  sendNotificationEndpoint,
};
