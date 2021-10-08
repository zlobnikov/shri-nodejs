const fs = require('fs');
const util = require('util');

Я бы не называл этот модуль fs, вызывает вопросы, почему он назывется так же, как core-модуль

Эти штуки - полезные 👍
const writeFileAsync = util.promisify(fs.writeFile);
const unlinkFileAsync = util.promisify(fs.unlink);
const existsFileAsync = util.promisify(fs.exists);

Все эти утилиты выглядят лишними. Все это можно заинлайнить в код
module.exports = {
  writeFile: async (path, content) => {
    await writeFileAsync(path, content, { encoding: 'utf-8' });
  },

  removeFile: async (path) => {
    try {
      await unlinkFileAsync(path);
    } catch (err) {
      console.log(`removeFile error: file ${path} doesn't exist...`);
    }
  },

  exists: async (path) => {
    return await existsFileAsync(path);
  },
};
