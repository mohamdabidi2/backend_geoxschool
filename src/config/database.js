const mongoose = require("mongoose");

let cachedConnection = null;

async function connectDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in the environment.");
  }

  mongoose.set("strictQuery", true);

  try {
    cachedConnection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB");
    return cachedConnection;
  } catch (error) {
    cachedConnection = null;
    console.error("Failed to connect to MongoDB:", error.message);
    throw error;
  }
}

module.exports = connectDatabase;


