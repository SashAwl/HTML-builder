const fs = require('fs');
const path = require('node:path');

const pathFile = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(pathFile);

process.stdout.write(
  'Enter text to write to file. Enter "exit" to finish...\n',
);

process.stdin.on('data', (dataChunk) => {
  const dataChunkStr = dataChunk.toString().trim();
  if (dataChunkStr.toLowerCase() === 'exit') {
    writeStream.end();
  } else {
    writeStream.write(dataChunk + '\n');
  }
});

writeStream.on('finish', () => {
  process.stdout.write('The recording is closed. See you soon!');
  process.exit();
});

process.on('SIGINT', () => {
  writeStream.end();
});

writeStream.on('error', (err) => {
  console.error('Error creating file:', err.message);
});
