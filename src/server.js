const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
  quiet: true,
});
const app = require("./app");
const connectDatabase = require("./config/db");
const seedDatabase = require("./data/seed");

const port = Number(process.env.PORT) || 5000;

async function start() {
  try {
    await connectDatabase();
    await seedDatabase();
    app.listen(port, () => console.log(`JobBoard API listening on http://localhost:${port}`));
  } catch (error) {
    console.error("Unable to start API:", error.message);
    process.exit(1);
  }
}

start();
