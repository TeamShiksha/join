const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');
const config = require('./config/config');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/api', bookRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found. Please refer to the API documentation.'
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server',
    error: err.message
  });
});

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

module.exports = app;
