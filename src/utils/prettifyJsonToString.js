module.exports = {
  Тоже не очень понятно, зачем для этого выделять отдельную функцию
  prettifyJsonToString: json => JSON.stringify(json, null, '\t'),
};
