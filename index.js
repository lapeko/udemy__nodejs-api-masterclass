const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("X-Powered-By", "Blabla");
  res.write("<h1>Header</h1>");
  res.write("<p>Some text</p>");
  res.statusCode = 200;
  res.end();
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
