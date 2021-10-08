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

Заметил, что где-то точки с запятой стоят, а где-то нет
Чтобы таких проблем не было, рекомендую использовать prettier/eslint
const upload = multer({ storage: storage })

👍
app.get('/ping', (req, res) => res.json({ ping: 'pong' }));

app.post('/upload', upload.single('image'), async (req, res) => {
  А если имя файла какое.нибудь.вот.такое.jpeg ?
  const id = req.file.filename.split('.')[0];
  const size = req.file.size;
  const img = new Image(id, size);

  await db.insert(img);

  Имя файла - плохой вариант для id. Что, если я загружу два разных файла с одинаковым именем?
  Нужно использовать какую-нибудь библиотеку для генерации uuid и использовать его в качестве id и имени файла на диске
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

  Что произойдет, если такого файла не окажется? Нужно это обработать
  Мне кажется, имя файла сохранять и передавать не нужно, пусть юзер сам выбирает, как его назвать
  res.download(path.resolve(imageFolder, imageId + '.jpg'));
});

app.get('/merge', (req, res) => {
  const params = req.query;

  // TODO: validate data 😉
  params.color = params.color.split(',').map(Number);
  params.threshold = Number(params.threshold);

  const front = fs.createReadStream(
    Я бы тут отказался от расширений, на самом деле. Для чего они нам?
    path.resolve(imageFolder, params.front + '.jpg')
  );

  const back = fs.createReadStream(
    Хорошо бы обработать отсутствие запрошенных изображений
    path.resolve(imageFolder, params.back + '.jpg')
  );

  Выше async/await, а здесь - then-ы. Почему?
  replaceBackground(front, back, params.color, params.threshold).then(
    readableStream => {
      readableStream.pipe(res);
    }
  ).catch(e => res.status(500).send(e.message));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
