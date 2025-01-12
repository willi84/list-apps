#!/usr/bin/env node
const process = require('process');
const execSync = require('child_process').execSync;
const prompts = require('prompts');
const directory = process.argv[2];
const base = process.argv[3];
const os = require('os');
const { getApps } = require('./src');
const { writeFileSync, existsSync } = require('fs');
const path = require('path');
const { LOG, INFO, ERROR } = require('./src/log/log');
const searchDir = directory || './';
const basePath = base || '~';
const apps = getApps(searchDir);
const PATH_CONFIG = path.resolve(__dirname, './config.env');
if(existsSync(PATH_CONFIG)){

} else {
    LOG(ERROR, `config.env not found`);
    process.exit(); // exit
}
const config = require('dotenv').config({ path: PATH_CONFIG });
console.log(config)
if(!config){
    LOG(ERROR, `config.env not found`);
    // stop script
    return 1;
}

const choices = [];
for (const folder in apps) {
    if (folder !== '') {
        // TODO: verif
        for (const app of apps[folder]) {
            choices.push({
                title: app.name,
                value: app.path,
                description: app.path
            });
        }
    }
}
LOG(INFO,`\n👉 List my apps [${choices.length}]\n`);
if (choices.length === 0) {
    console.log('No apps found');
} else {
    let response;
    (async () => {
        response = await prompts({
            type: 'autocomplete',
            name: 'value',
            message: 'Pick an app with keys or by typing first character',
            choices: [...choices],
            initial: 1
        });
    
        // check if folder exists
        // write to file also overwrite
        await console.log(execSync('pwd').toString());
        const tmpFile = path.resolve(os.tmpdir(), 'list_apps_tmp');
        // execSync('touch ~/.cache/list_apps_tmp');
        // writeFileSync('~/.cache/list_apps_tmp', response.value);
    
        const value = `${basePath}/${response.value}`;
        console.log(value); // => { value: 24 }
        writeFileSync(`${tmpFile}`, `${value}`, { flag: 'w' });
        console.log(os.tmpdir()); // => { value: 24 }
        console.log(response); // => { value: 24 }
        // execSync(`FOOBAR=${response.value}`, { stdio: 'inherit' });
        //     const newdir = response.value;
        //     // run change dir
        //     try {
            //         const cwd = process.cwd();
            //         console.log(`cd ${cwd}/${newdir}`);
            //         // exec(`cd ${searchDir}${newdir}`); // change dir to the selected app
    //         // process.chdir(`${cwd}/${newdir}`);
    //         // await execSync(`cd ${cwd}/${newdir}`, { stdio: 'inherit' });
    //         // await execSync(`pwd`, { stdio: 'inherit' });
    
    //         // root directory of application
    //         execSync(`pwd`, { stdio: 'inherit' });
    //         // change director of the terminal
    //         execSync(`ls -al`, { stdio: 'inherit' });
    //         execSync(`${__dirname}/cd.sh ${cwd}/${newdir}`, { stdio: 'inherit' });
    //         execSync(`pwd`, { stdio: 'inherit' });
    
    //     } catch (error) {
        //         console.log(error);
        //     }
    })();
}
