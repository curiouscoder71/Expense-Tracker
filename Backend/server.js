const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connect to SQLite
const db = new sqlite3.Database('./data.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to SQLite database.');
});

// Create table (if not exists)
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT
)`);

// POST: Add user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, [name, email], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, email });
  });
});

// GET: Fetch users
app.get('/api/users', (req, res) => {
  db.all(`SELECT * FROM users`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
