const { v4: uuidv4 } = require('uuid');

Для чего это? Можно было просто сделать в целевом файле так: const {v4: generateId} = require('uuid')
module.exports = {
  generateId: () => uuidv4(),
};
