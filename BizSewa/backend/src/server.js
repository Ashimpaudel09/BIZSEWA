console.log("🚀 server.js file loaded");

const dotenv = require("dotenv");
const app = require("./app");
const { pool, initDB } = require("./config/db");

dotenv.config();

const PORT = process.env.PORT || 5005;

async function start() {
  try {
    console.log("👉 start() called");

    await pool.query("SELECT 1");
    console.log("✅ Connected to MySQL");

    await initDB();

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server", err);
    process.exit(1);
  }
}

start();
