const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Parse plain text
app.use(bodyParser.text());

app.post('/minutes-since', (req, res) => {
  const timestamp = req.body;

  if (!timestamp || typeof timestamp !== 'string') {
    return res.status(400).json({ error: 'Expected a datetime string in request body.' });
  }

  try {
    const then = new Date(timestamp);
    const now = new Date();

    if (isNaN(then.getTime())) {
      return res.status(400).json({ error: 'Invalid date format.' });
    }

    const diffMs = now - then;
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
