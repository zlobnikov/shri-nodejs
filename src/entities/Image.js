const path = require('path');

const { imageFolder } = require('../config');
const { generateId } = require('../utils/generateId');

module.exports = class Image {
  constructor(id, createdAt) {
    this.id = id || generateId();
    this.createdAt = createdAt || Date.now();

    this.originalFilename = `image_${this.id}.jpg`;
  }

  async saveOriginal(content) {
    await writeFile(path.resolve(imageFolder, this.originalFilename), content);
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
