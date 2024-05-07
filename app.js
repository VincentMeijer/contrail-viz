const express = require('express');
const path = require("path");
const app = express();
const port = 3000; // You can choose any port that's free on your system

// Middleware to enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Allows all origins
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('public'));

// Define a route
app.get('/sac', (req, res) => {
    // Ensure the path is absolute to avoid sending the wrong file
    res.sendFile(path.join(__dirname, 'public', 'sac.html'));
  });

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});