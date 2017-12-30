#!/usr/bin/env node

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const DEFAULT_DIR = 'dist';
const workDir = process.cwd();

const cleanDir = (dir, exclude) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        if (exclude.indexOf(file) === -1) fse.removeSync(path.join(workDir, file));
    });
};

const install = () => {
    const pkgFilename = 'package.json';
    const pkg = require(path.join(workDir, pkgFilename));

    const distDirname = (pkg.inless && pkg.inless.dist) || DEFAULT_DIR;
    const exclude = [pkgFilename, distDirname, '.git', '.gitignore', 'node_modules', 'yarn.lock', 'package.lock'];

    cleanDir(workDir, exclude);
    fse.moveSync(path.join(workDir, distDirname), workDir);
};

if (path.basename(path.dirname(workDir)) === 'node_modules') install();
