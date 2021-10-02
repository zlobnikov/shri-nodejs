const express = require('express');
const { PORT, imageFolder } = require('./config');
const db = require('./entities/Database');
const Image = require('./entities/Image');

const app = express();

app.use(express.json());

app.get('/ping', (req, res) => res.json({ ping: 'pong' }));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
