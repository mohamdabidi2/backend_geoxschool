require("dotenv").config();

const app = require("./server");
const connectDatabase = require("./config/database");

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
}

startServer();


