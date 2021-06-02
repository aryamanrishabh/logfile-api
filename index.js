const http = require("http");
const url = require("url");
const fs = require("fs");
const readline = require('readline');
const querystring = require("querystring");

const data = fs.readFileSync("test.txt");

const readInterface = readline.createInterface({
  input: fs.createReadStream('test.txt'),
  console: true
});

const server = http.createServer((req, res) => {
  const urlparse = new URL(req.url, "http://localhost:7000/");

  if (urlparse.pathname == "/logs" && req.method == "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(data);
  }
  if (urlparse.pathname == "/logs/timeframe" && req.method == "GET") {
    let start, end;
    let start_time, end_time;
    let output = "";

    const search = urlparse.search;
    if (search) {
      const [, query] = urlparse.search.split("?");
      start = parseInt(querystring.parse(query).start);
      start = new Date(start * 1000).toISOString();
      end = parseInt(querystring.parse(query).end);
      end = new Date(end * 1000).toISOString();

      start_time = new Date(start * 1000);
      end_time = new Date(end * 1000);

      readInterface.on('line', function(line){
        const [time, ] = line.split(" ");
        time = Date.parse(new Date(time));
        if( time > start && time <= end){
          output += line + "\n ";
        }
      });
    }
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`Start time is ${start} or ${start_time} and end time is ${end} or ${end_time}`);
    //res.end(output);
  }
});

if (server.listen(7000)) {
  console.log("Server is running on 7000...");
}
