// Import the required modules
const { readFilesRecursively, getAppDirectory } = require('./fs/fs');

function getApps(directory) {
    const fileList = readFilesRecursively(directory, 5, []);
    const apps = getAppDirectory(directory, fileList);
    return apps;
}

module.exports.getApps = getApps;
