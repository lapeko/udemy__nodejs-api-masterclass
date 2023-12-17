const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {
  const auth = req.headers["authorization"];
  console.log("Authorization: ", auth);

  res.writeHead(200, {
    "Content-Type": "text/html",
    "X-Powered-By": "Blabla",
  });

  const chunks = [];
  req
    .on("data", (chunk) => chunks.push(chunk))
    .on("end", () => {
      console.log(Buffer.concat(chunks).toString());
    });

  res.write("<h1>Header</h1>");
  res.write("<p>Some text</p>");
  res.end();
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
