#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const del = require('del');

const workDir = process.cwd();
del.sync([
    `${workDir}/**`,
    `!${workDir}`,
    `!${path.join(workDir, 'package.json')}`,
    `!${path.join(workDir, 'src')}/**`,
]);

fs.copy(path.join(workDir, 'src'), workDir, function (err) {
    if (err) {
        console.log('[post-install] An error occured while copying the folder.');
        return console.error(err);
    }

    del.sync([`${workDir}/src/**`]);
});
