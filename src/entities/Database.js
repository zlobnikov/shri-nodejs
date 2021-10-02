const { EventEmitter } = require('events');
const { existsSync } = require('fs');
const { dbDumpFile } = require('../config');
const { writeFile } = require('../utils/fs');
const { prettifyJsonToString } = require('../utils/prettifyJsonToString');
const Image = require('./Image');

class Database extends EventEmitter {
  constructor() {
    super();

    this.idToImage = {};
  }

  async initFromDump() {
    if (existsSync(dbDumpFile) === false) {
      return;
    }

    const dump = require(dbDumpFile);

    if (typeof dump.idToImage === 'object') {
      this.idToImage = {};

      for (let id in dump.idToImage) {
        const img = dump.idToImage[id];

        this.idToImage[id] = new Image(img.id, img.createdAt);
      }
    }
  }

  async insert(img) {
    this.idToImage[img.id] = img;

    this.emit('changed');
  }

  async remove(imageId) {
    const imageRaw = this.idToImage[imageId];

    const img = new Image(imageRaw.id, imageRaw.createdAt);

    await img.removeOriginal();

    delete this.idToImage[imageId];

    this.emit('changed');

    return imageId;
  }

  findOne(imageId) {
    const imageRaw = this.idToImage[imageId];

    if (!imageRaw) {
      return null;
    }

    const img = new Image(imageRaw.id, imageRaw.createdAt);

    return img;
  }

  toJSON() {
    return {
      idToImage: this.idToImage,
    };
  }
}

const db = new Database();

db.initFromDump();

db.on('changed', () => {
  writeFile(dbDumpFile, prettifyJsonToString(db.toJSON()));
});

module.exports = db;
