const http = require("http");
const url = require("url");
const fs = require("fs");
const querystring = require("querystring");

const file = "example.txt";

const stream = fs.createReadStream(file, {
  flags: "r",
  encoding: "utf-8",
  fd: null,
  mode: "0666",
  bufferSize: 64 * 1024,
});

let fileData = "";
let lines;

stream.on("data", function (data) {
  fileData += data;

  lines = fileData.split("\n");
});

const server = http.createServer((req, res) => {
  const urlparse = new URL(req.url, "http://localhost:7000/");

  if (urlparse.pathname == "/logs" && req.method == "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(fileData);
  }
  if (urlparse.pathname == "/logs/timeframe" && req.method == "GET") {
    let start, end;
    let start_time, end_time;
    let output = "";

    const search = urlparse.search;
    let result;

    if (search) {
      const [, query] = urlparse.search.split("?");
      start = parseInt(querystring.parse(query).start);
      end = parseInt(querystring.parse(query).end);

      result = lines.filter(
        (line) =>
          Date.parse(line.split(" ")[0]) > start &&
          Date.parse(line.split(" ")[0]) < end
      );
      output = result.join("\n");
    }
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(output);
  }
});

server.listen(7000);
console.log('Server is running on port 7000...')
