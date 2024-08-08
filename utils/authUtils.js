const { GoogleAuth } = require("google-auth-library");
const fs = require("fs");

const auth = new GoogleAuth({
  keyFile: "./fxcarrerspushnoti.json", // Replace with the path to your service account key file
  scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
});

// Get access token using JWT
async function getAccessToken() {
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  return accessToken.token;
}

// Refresh the access token if it has expired
async function refreshAccessToken(tokens) {
  if (!tokens.accessToken || Date.now() >= tokens.expiryTime) {
    try {
      const accessToken = await getAccessToken();

      // Update tokens
      tokens.accessToken = accessToken;
      tokens.expiresIn = 3600; // Token expires in 1 hour
      tokens.expiryTime = Date.now() + tokens.expiresIn * 1000;

      return tokens; // Return updated tokens
    } catch (error) {
      throw error;
    }
  } else {
    return tokens.accessToken; // Return the existing token if it has not expired
  }
}

module.exports = {
  refreshAccessToken,
};
