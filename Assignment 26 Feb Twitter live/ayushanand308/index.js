const express = require('express');
const app = express();
const bookRoutes = require('./endpoints');

app.use(express.json());
app.use('/api/v0', bookRoutes);

const PORT = 8088;
app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
}); 