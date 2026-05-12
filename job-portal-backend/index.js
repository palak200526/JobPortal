const fs = require("fs");
const path = require("path");

const app = require("./app");
const { initializeDatabase, closeDatabase } = require("./config/db");

const PORT = Number(process.env.PORT || 5000);
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

async function startServer() {
  await initializeDatabase();

  const server = app.listen(PORT, () => {
    console.log(`AuraJobs backend running on port ${PORT}`);
  });

  const gracefulShutdown = async () => {
    console.log("Gracefully shutting down AuraJobs backend...");
    server.close(async () => {
      await closeDatabase();
      process.exit(0);
    });
  };

  process.on("SIGINT", gracefulShutdown);
  process.on("SIGTERM", gracefulShutdown);
}

startServer().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});
