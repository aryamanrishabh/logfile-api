const http = require("http");
const url = require("url");
const fs = require("fs");
const readline = require("readline");
const querystring = require("querystring");

const file = "example.txt";

//const data = fs.readFileSync(file);

const stream = fs.createReadStream(file, {
  flags: "r",
  encoding: "utf-8",
  fd: null,
  mode: "0666",
  bufferSize: 64 * 1024,
});

let fileData = "";
let lines;
let datetime;

stream.on("data", function (data) {
  fileData += data;

  lines = fileData.split("\n");

  datetime = lines.map((word) => {
    return Date.parse(word.split(" ")[0]);
  });
});

const server = http.createServer((req, res) => {
  const urlparse = new URL(req.url, "http://localhost:7000/");

  if (urlparse.pathname == "/logs" && req.method == "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(fileData);
    console.log(lines);
    console.log(datetime);
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
      //start = new Date(start).toISOString();
      end = parseInt(querystring.parse(query).end);
      //end = new Date(end).toISOString();

      // start_time = new Date(start);
      // end_time = new Date(end);

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

if (server.listen(7000)) {
  console.log("Server is running on 7000...");
}
