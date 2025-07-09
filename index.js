// index.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

app.post('/since', (req, res) => {
  const { timestamp } = req.body;

  if (!timestamp) {
    return res.status(400).json({ error: 'Missing timestamp in request.' });
  }

  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now - then;
  const diffMinutes = Math.floor(diffMs / 60000);

  res.json({ minutesAgo: diffMinutes });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Timer service running on port ${PORT}`);
});
