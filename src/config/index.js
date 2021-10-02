const path = require('path');

const dbFolder = path.resolve(__dirname, '../../db/');
const dbDumpFile = path.resolve(dbFolder, 'dump.json');
const imageFolder = path.resolve(dbFolder, 'img');

module.exports = {
  PORT: 8080,

  imageFolder,
  dbDumpFile,
};
