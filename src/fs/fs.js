const fs = require('fs');
const path = require('path');

const ignoreFolders = [
    '.git',
    'node_modules',
    '.cache',
    '.vscode-server',
    '.npm'
];
const readFilesRecursively = (dir, limit = -1, fileList = []) => {
    const hasLimit = limit > -1;
    const files = fs
        .readdirSync(dir)
        .filter((file) => ignoreFolders.indexOf(file) === -1);
    const filePathes = files.map((file) => path.join(dir, file));
    filePathes.forEach((filePath) => {
        const currentLevel = filePath.split('/').length;
        if (hasLimit && currentLevel > limit) {
            return;
        }

        if (fs.statSync(filePath).isDirectory()) {
            readFilesRecursively(filePath, limit, fileList);
            fileList.push({ path: filePath, type: 'folder' });
        } else {
            fileList.push({ path: filePath, type: 'file' });
        }
    });
    return fileList;
};
const getAppDirectory = (directory, fileList) => {
    const apps = fileList
        .filter((file) => file.type === 'file')
        .filter((file) => file.path.indexOf('package.json') > -1)
        .map((file) => {
            return file.path.replace('package.json', '');
        });
    const folders = apps.map((app) =>
        app
            .replace(directory, '')
            .replace(/\/$/, '')
            .replace(/^\//, '')
            .split('/')
            .slice(0, -1)
            .join('/')
    );
    const firstLevelFolders = [];
    const result = {};
    for (const folder of folders) {
        const folderName = folder
            .replace(/\/$/, '')
            .replace(`${directory}/`, '')
            .split('/')[0];
        if (firstLevelFolders.indexOf(folderName) === -1) {
            firstLevelFolders.push(folderName);
        }
    }
    for (const firstLevelFolder of firstLevelFolders.sort()) {
        if (!result[firstLevelFolder]) {
            result[firstLevelFolder] = [];
        }
        for (const app of apps) {
            if (app.indexOf(firstLevelFolder) > -1) {
                const appName = app.replace(/\/$/, '').split('/').pop();
                const appPath = app
                    // .replace(directory, '')
                    .replace(/\/$/, '');
                result[firstLevelFolder].push({ name: appName, path: appPath });
            }
        }
    }
    return result;
    // }
};
exports.getAppDirectory = getAppDirectory;
exports.readFilesRecursively = readFilesRecursively;
