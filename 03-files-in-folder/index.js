const fs = require('fs/promises');
const path = require('node:path');

async function displayFilesInfo() {
  try {
    const folderPath = path.join(__dirname, 'secret-folder');
    const folderContent = await fs.readdir(folderPath, {
      withFileTypes: true,
    });

    for (const item of folderContent) {
      if (item.isFile()) {
        const extname = path.extname(item.name);
        const fileName = path.basename(item.name, extname);
        const fileExtension = extname.slice(1);

        const filePath = path.join(folderPath, item.name);
        const fileStats = await fs.stat(filePath);
        const fileSize = fileStats.size;

        console.log(
          `${fileName} - ${fileExtension} - ${(fileSize / 1024).toFixed(2)}Кб`,
        );
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}

displayFilesInfo();
