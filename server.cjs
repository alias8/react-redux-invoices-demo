const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// Load data from db.json
const dbPath = path.join(__dirname, 'db.json');
let dbData = {};
try {
  const dbContent = fs.readFileSync(dbPath, 'utf8');
  dbData = JSON.parse(dbContent);
} catch (error) {
  console.error('Error loading db.json:', error);
}

// API routes
app.get('/api/profile', (req, res) => {
  res.json(dbData.profile || {});
});

app.get('/api/skills', (req, res) => {
  res.json(dbData.skills || []);
});

app.get('/api/experience', (req, res) => {
  res.json(dbData.experience || []);
});

app.get('/api/education', (req, res) => {
  res.json(dbData.education || []);
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing, return all requests to the app (but only for non-API routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
