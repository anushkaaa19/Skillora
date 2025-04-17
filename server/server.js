const express = require('express');
const app = express();
const PORT = 4000;

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
