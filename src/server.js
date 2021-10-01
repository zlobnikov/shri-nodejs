const http = require('http');

const PORT = 8080;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    return res.end('Hi!');
  }

  res.statusCode = 404;
  return res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Port: ${PORT}`);
});
