const fs = require('node:fs');
const path = require('node:path');

const pathFile = path.join(__dirname, 'text.txt');
const readSrteam = fs.createReadStream(pathFile, 'utf-8');

readSrteam.on('data', (data) => {
  process.stdout.write(data);
});

readSrteam.on('error', (err) => {
  process.stderr.write(err.message);
});
