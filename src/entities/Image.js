const path = require('path');

const { imageFolder } = require('../config');
const { writeFile, removeFile } = require('../utils/fs');
const { generateId } = require('../utils/generateId');

module.exports = class Image {
  constructor(id, createdAt) {
    this.id = id || generateId();
    this.createdAt = createdAt || Date.now();

    this.originalFilename = `image_${this.id}.jpg`;
  }

  async removeOriginal() {
    await removeFile(path.resolve(imageFolder, this.originalFilename));
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
    };
  }
};
