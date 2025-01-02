#!/usr/bin/env node
const directory = process.argv[2];
const { getApps } = require('./src');
console.log('\n👉 List my apps\n');
const searchDir = directory || './';
getApps(searchDir);
// console.log('apps');
// console.log(apps);
