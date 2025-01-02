// Import the required modules
const fs = require('fs');
const path = require('path');

const ignoreFolders = ['.git', 'node_modules'];

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

function getApps(directory) {
    const fileList = readFilesRecursively(directory, 5, []);
    const apps = getAppDirectory(directory, fileList);
    const yellowFg = '\x1b[33m';
    const magentaFg = '\x1b[35m';
    const end = '\x1b[0m';
    // const sortedFolders = firstLevelFolder.sort();
    for (const folder of Object.keys(apps)) {
        console.log(`\n${magentaFg} ${folder} ${end}`);
        const appsPerFolder = apps[folder];
        for (const item of appsPerFolder) {
            const app = item.path;
            if (app.indexOf(folder) > -1) {
                const appName = app.replace(/\/$/, '').split('/').pop();
                const appPath = app.replace(/\/$/, '').replace(directory, '');
                console.log(`   ${yellowFg} - ${appName} ${end} [${appPath}]`);
            }
        }
    }
}
module.exports.getApps = getApps;
module.exports.readFilesRecursively = readFilesRecursively;
module.exports.getAppDirectory = getAppDirectory;
