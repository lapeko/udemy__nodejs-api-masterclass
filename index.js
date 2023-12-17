const http = require("http");

const PORT = 3000;

const todos = [];
const server = http.createServer((req, res) => {
  const response = {
    todos,
    error: null,
    success: true,
  };

  const chunks = [];
  req
    .on("data", (chunk) => chunks.push(chunk))
    .on("end", () => {
      data = JSON.parse(Buffer.concat(chunks).toString());

      res.writeHead(200, { "Content-Type": "application/json" });

      if (req.method === "GET" && req.url === "/todos") {
        res.end(JSON.stringify(response));
      } else if (req.method === "POST" && req.url === "/todos") {
        if (!data?.id || !data.description) {
          res.statusCode = 401;
          response.error = "Not provided necessary todo data";
          response.success = false;
          res.end(response);
        }
        todos.push(data);
        response.todos = todos;
        res.end(JSON.stringify(response));
      }
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
