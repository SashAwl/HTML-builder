const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

mergeStyles();

async function mergeStyles() {
  try {
    const styleList = [];
    const dirPath = path.join(__dirname, 'styles');
    const destPath = path.join(__dirname, 'project-dist', 'bundle.css');

    await fsp.rm(destPath, { force: true });

    const dirContent = await fsp.readdir(dirPath, { withFileTypes: true });

    for (const item of dirContent) {
      const srcItem = path.join(dirPath, item.name);
      const extnameItem = path.extname(item.name).slice(1);

      if (item.isFile() && extnameItem === 'css') {
        const data = await fsp.readFile(srcItem, 'utf-8');
        styleList.push(data);
      }
      const writeStream = fs.createWriteStream(destPath);
      for (const style of styleList) {
        writeStream.write(style + '\n');
      }
      writeStream.end();
    }
    process.stdout.write('The recording is closed. See you soon!');
  } catch (err) {
    process.stderr.write(err.message);
  }
}
