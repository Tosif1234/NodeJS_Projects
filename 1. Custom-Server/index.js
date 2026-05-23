const http = require("http");
const fs = require("fs");
const querystring = require("querystring");

const port = 8000;

const app = http.createServer((req, res) => {
  let url = req.url;
  let fileName = "";

  let [path, queryStr] = url.split("?");
  let query = querystring.parse(queryStr);

  switch (path) {
    case "/":
      fileName = "index.html";
      break;
    case "/about":
      fileName = "about.html";
      break;
    case "/contact":
      fileName = "contact.html";
      break;

    case "/api":
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ name: "Tosif", course: "NodeJS" }));
      return;

    case "/text":
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Hello World");
      return;

    case "/user":
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`Hello ${query.name || "Guest"}`);
      return;

    default:
      res.writeHead(404, { "Content-Type": "text/html" });
      fileName = "404.html";
  }

  fs.readFile(fileName, (err, data) => {
    if (err) {
      res.end("Error loading file");
    } else {
      if (!res.headersSent) {
        res.writeHead(200, { "Content-Type": "text/html" });
      }
      res.end(data);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
