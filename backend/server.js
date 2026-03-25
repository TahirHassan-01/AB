const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// PostgreSQL connection
const pool = new Pool({
  host: "db",         // Use 'db' if using Docker Compose, or 'localhost' if running locally
  user: "postgres",
  password: "example",
  database: "colorsdb",
  port: 5432,
});

// Initialize Database Table
pool.query(`
  CREATE TABLE IF NOT EXISTS colors (
    id SERIAL PRIMARY KEY,
    color TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).then(() => console.log("Database table ready"))
  .catch(err => console.error("Database init error:", err));

// POST: Save a new color
app.post("/submit", async (req, res) => {
  const { color } = req.body;
  try {
    await pool.query("INSERT INTO colors(color) VALUES($1)", [color]);
    res.send("Color saved successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving data");
  }
});

// GET: Fetch all colors (The new part!)
app.get("/colors", async (req, res) => {
  try {
    const result = await pool.query("SELECT color FROM colors ORDER BY id DESC");
    res.json(result.rows); 
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
