//index.js

// Import the required modules
const fs = require('fs');
const path = require('path');


   const readFilesRecursively = (dir, fileList = [], maxLevel = 1)=>  {
        // const fileList = [];
        const files = fs.readdirSync(dir);
        let currentLevel = 1;
        const matchList = []
    
        files.forEach(file => {
            const filePath = path.join(dir, file);
            

            if (fs.statSync(filePath).isDirectory() && filePath.indexOf('node_modules') === -1  && filePath.indexOf('.git') === -1) {
                // console.log(filePath)
                currentLevel++;
                // if (currentLevel >= maxLevel) {
                //     return;
                // }
                readFilesRecursively(filePath, fileList);
                fileList.push({ path: filePath, type: 'folder'});
            } else {
                
                fileList.push({ path: filePath, type: 'file'});
            }
        });
    
        return fileList;
    }

function getApps() {
    // const fileList = readFilesRecursively('./');
    return 'fileList'
}
  
module.exports = getApps