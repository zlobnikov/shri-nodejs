const express = require('express');
const multer = require('multer');

const { PORT, imageFolder } = require('./config');
const db = require('./entities/Database');
const Image = require('./entities/Image');
const { generateId } = require('./utils/generateId');

const app = express();

app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './db/img');
  },

  filename: function (req, file, cb) {
    cb(null, generateId() + '.jpg');
  }
})

const upload = multer({ storage: storage })

app.get('/ping', (req, res) => res.json({ ping: 'pong' }));

app.post('/upload', upload.single('image'), async (req, res) => {
  const id = req.file.filename.split('.')[0];
  const size = req.file.size;
  const img = new Image(id, size);

  await db.insert(img);

  return res.json({id});
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
