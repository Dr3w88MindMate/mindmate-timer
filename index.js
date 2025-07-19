const express = require('express');
const bodyParser = require('body-parser');
const { DateTime } = require('luxon');

const app = express();
app.use(bodyParser.text());

// 🔐 API key middleware
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.API_KEY;

  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
  }

  next(); // API key is valid, continue to handler
};

app.post('/minutes-since', apiKeyMiddleware, (req, res) => {
  const rawInput = req.body;

  if (!rawInput || typeof rawInput !== 'string') {
    return res.status(400).json({ error: 'Expected a datetime string in the request body.' });
  }

  try {
    // Try native parsing first
    let parsedDate = new Date(rawInput);

    // If native parse fails (NaN), try using Luxon
    if (isNaN(parsedDate.getTime())) {
      parsedDate = DateTime.fromFormat(rawInput.trim(), 'LLLL d, yyyy h:mm a', { zone: 'Asia/Singapore' }).toJSDate();
    }

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format. Expected format like "July 9, 2025 8:41 PM".' });
    }

    const now = new Date();
    const diffMs = now - parsedDate;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    res.json({ minutesAgo: diffMinutes });
  } catch (err) {
    res.status(500).json({ error: 'Internal error', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Timer service running on port ${PORT}`);
});
