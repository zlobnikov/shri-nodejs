const path = require('path');

const { imageFolder } = require('../config');
const { removeFile } = require('../utils/fs');
const { generateId } = require('../utils/generateId');

module.exports = class Image {
  constructor(id = generateId(), size, createdAt = Date.now()) {
    this.id = id;
    this.size = size;
    this.createdAt = createdAt;

    this.originalFilename = `${this.id}.jpg`;
  }

  async removeOriginal() {
    await removeFile(path.resolve(imageFolder, this.originalFilename));
  }

  toJSON() {
    return {
      id: this.id,
      size: this.size,
      createdAt: this.createdAt,
    };
  }
};
