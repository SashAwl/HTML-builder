const fs = require('fs/promises');
const path = require('path');

copyContentDir();

async function copyContentDir() {
  const srcDir = path.join(__dirname, 'files');
  const destDir = path.join(__dirname, 'files-copy');

  try {
    await fs.rm(destDir, { recursive: true, force: true });
    await copyDir(srcDir, destDir);

    console.log('Копирование завершено.');
  } catch (err) {
    console.error(`Ошибка копирования: ${err.message}`);
  }
}

async function copyDir(srcDir, destDir) {
  try {
    await fs.mkdir(destDir, { recursive: true });

    const srcContent = await fs.readdir(srcDir, { withFileTypes: true });

    for (const item of srcContent) {
      const srcItemPath = path.join(srcDir, item.name);
      const destItemPath = path.join(destDir, item.name);
      if (item.isFile()) {
        await fs.copyFile(srcItemPath, destItemPath);
      }
      if (item.isDirectory()) {
        await copyDir(srcItemPath, destItemPath);
      }
    }
  } catch (err) {
    console.error(`Ошибка при копировании: ${err.message}`);
  }
}
