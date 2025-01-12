#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { LOG, OK, WARNING, ERROR, INFO } = require('./src/log/log');
const { detectFragement } = require('./src/detect/detect');
const {
    createCommandFunction,
    updateBashConfiguration,
    printResult,
    LOG_
} = require('./src/install/install');
const FILE_NAME = '.bash_aliases';
// Path to the user's bashrc file
const bashrcPath = path.resolve(process.env.HOME, FILE_NAME);

// read config.env file
const configPath = path.resolve(__dirname, './config.env');
const cfg = require('dotenv').config({ path: configPath });
const config = cfg.parsed;
LOG(OK, 'installing ....');

const scriptPath = `${path.resolve(__dirname, './index.js')}`;
// The command to add to bashrc
// alias aa="node ${script} \$@ && cd \$(cat /tmp/list_apps_tmp) && rm /tmp/list_apps_tmp"
const KEY = config.LMA_NAME;
const date = `${new Date().toISOString().replace('T', ' ').replace('Z', '').replace(/\.\d*/, '')}`;
const commandToAdd = createCommandFunction(config, scriptPath, date);

if (fs.existsSync(bashrcPath)) {
    let bashrcContent = fs.readFileSync(bashrcPath, 'utf8');
    const result = updateBashConfiguration(bashrcContent, commandToAdd, KEY);
    const check = detectFragement(result.newContent, config.LMA_NAME);
    if (check.length > 1) {
        const msg = `[CHECK] multiple ${KEY} detected [${check.length}]`;
        LOG_(result.logs, ERROR, `${msg}`);
    } else if (check.length === 0) {
        LOG_(result.logs, ERROR, `[CHECK] ${KEY} not added`);
    }
    printResult(result.logs, [OK, WARNING, ERROR]);
    fs.writeFileSync(bashrcPath, result.newContent, 'utf8');
    LOG(OK, `~/${FILE_NAME} command "${KEY}" added. `);
    LOG(INFO, 'Please source it or restart your shell.');
} else {
    // If .bashrc doesn't exist, create it and add the command
    fs.writeFileSync(bashrcPath, commandToAdd, 'utf8');
    LOG(OK, `~/${FILE_NAME} command "${KEY}" added. `);
    LOG(INFO, 'Please source it or restart your shell.');
}
LOG(OK, 'successfull install.js');
