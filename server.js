const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

// Serve static files from the root directory
app.use(express.static('.', {
  setHeaders: (res, path) => {
    // Disable caching to ensure updates are visible immediately
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
}));

// Serve the main index.html from campuspathway.in for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'campuspathway.in', 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
  console.log('Serving static WordPress site...');
});
