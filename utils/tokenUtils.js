const fs = require("fs");

const TOKEN_FILE_PATH = "./tokens.json";

// Load tokens from file
const loadTokens = () => {
  try {
    const data = fs.readFileSync(TOKEN_FILE_PATH, "utf8");
    if (data) {
      return JSON.parse(data);
    } else {
      return {};
    }
  } catch (err) {
    return {};
  }
};

// Save tokens to file
const saveTokens = (tokens) => {
  try {
    fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify(tokens, null, 2));
  } catch (err) {
    console.error("Failed to save tokens:", err);
  }
};

module.exports = {
  loadTokens,
  saveTokens,
};
