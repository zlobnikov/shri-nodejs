const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { PORT, imageFolder } = require('./config');
const db = require('./entities/Database');
const Image = require('./entities/Image');
const { generateId } = require('./utils/generateId');
const { replaceBackground } = require('backrem');

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

app.get('/list', (req, res) => {
  const allImages = db.findAll().map(img => img.toJSON());

  return res.send(allImages);
});

app.delete('/image/:id', async (req, res) => {
  const imageId = req.params.id;

  const id = await db.remove(imageId);

  return res.json({id});
});

app.get('/image/:id', (req, res) => {
  const imageId = req.params.id;
  res.download(path.resolve(imageFolder, imageId + '.jpg'));
});

app.get('/merge', (req, res) => {
  const params = req.query;

  // TODO: validate data
  params.color = params.color.split(',').map(Number);
  params.threshold = +params.threshold;

  const front = fs.createReadStream(
    path.resolve(imageFolder, params.front + '.jpg')
  );

  const back = fs.createReadStream(
    path.resolve(imageFolder, params.back + '.jpg')
  );

  replaceBackground(front, back, params.color, params.threshold).then(
    readableStream => {
      readableStream.pipe(res);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
