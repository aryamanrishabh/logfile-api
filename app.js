const fs = require("fs");
const fsPromises = fs.promises;

const buffer = Buffer.alloc(1024);

console.log(fs.readFileSync("test.txt", "utf-8"));

async function doRead() {
  let filehandle = null;

  try {
    filehandle = await fsPromises.open("test.txt", "r+");
    await filehandle.read(buffer, 0, buffer.length, 3);
  } finally {
    if (filehandle) {
      await filehandle.close();
    }
  }
}

doRead().catch(console.error);
