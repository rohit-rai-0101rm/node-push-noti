const express = require("express");
const dotenv = require("dotenv");

// Load environment variables from the .env file
dotenv.config({ path: "./.env" });

// Import the controller functions for handling requests
const {
  saveToken,
  sendNotificationEndpoint,
} = require("./controllers/notificationsController");

// Create an Express application
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Retrieve the port number from environment variables (default to 3000 if not specified)
const PORT = process.env.PORT || 3000;

// Define routes and their corresponding handler functions
app.post("/save-token", saveToken); // Endpoint to save FCM token
app.post("/send-notification", sendNotificationEndpoint); // Endpoint to send push notifications

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log a message indicating the server is running
});
