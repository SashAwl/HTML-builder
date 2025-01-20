const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templateFile = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');

createProjectDist();

async function createProjectDist() {
  try {
    await fsp.mkdir(projectDist, { recursive: true });

    await generateHTML();
    await mergeStyles();
    await copyContentDir(assetsDir, path.join(projectDist, 'assets'));

    console.log('Сборка проекта завершена!');
  } catch (err) {
    console.error(err.message);
  }
}

async function generateHTML() {
  try {
    let template = await fsp.readFile(templateFile, 'utf-8');
    const componentFiles = await fsp.readdir(componentsDir, {
      withFileTypes: true,
    });

    for (const file of componentFiles) {
      if (file.isFile() && path.extname(file.name) === '.html') {
        const componentName = path.basename(file.name, '.html');
        const componentContent = await fsp.readFile(
          path.join(componentsDir, file.name),
          'utf-8',
        );
        const tag = `{{${componentName}}}`;
        template = template.split(tag).join(componentContent);
      }
    }

    const outputPath = path.join(projectDist, 'index.html');
    await fsp.writeFile(outputPath, template);
    console.log('index.html создан.');
  } catch (err) {
    console.error('Ошибка при генерации HTML:', err.message);
  }
}

async function mergeStyles() {
  try {
    const styleList = [];
    const destPath = path.join(projectDist, 'style.css');

    await fsp.rm(destPath, { force: true });

    const dirContent = await fsp.readdir(stylesDir, { withFileTypes: true });

    for (const item of dirContent) {
      const srcItem = path.join(stylesDir, item.name);
      const extnameItem = path.extname(item.name).slice(1);

      if (item.isFile() && extnameItem === 'css') {
        const data = await fsp.readFile(srcItem, 'utf-8');
        styleList.push(data);
      }
    }

    await fsp.writeFile(destPath, styleList.join('\n'));
    console.log('style.css создан.');
  } catch (err) {
    console.error('Ошибка при создании стилей:', err.message);
  }
}

async function copyContentDir(srcDir, destDir) {
  try {
    await fsp.rm(destDir, { recursive: true, force: true });
    await copyDir(srcDir, destDir);
    console.log('Копирование завершено.');
  } catch (err) {
    console.error(`Ошибка копирования: ${err.message}`);
  }
}

async function copyDir(srcDir, destDir) {
  try {
    await fsp.mkdir(destDir, { recursive: true });

    const srcContent = await fsp.readdir(srcDir, { withFileTypes: true });

    for (const item of srcContent) {
      const srcItemPath = path.join(srcDir, item.name);
      const destItemPath = path.join(destDir, item.name);

      if (item.isFile()) {
        await fsp.copyFile(srcItemPath, destItemPath);
      }

      if (item.isDirectory()) {
        await copyDir(srcItemPath, destItemPath);
      }
    }
  } catch (err) {
    console.error(`Ошибка при копировании: ${err.message}`);
  }
}
