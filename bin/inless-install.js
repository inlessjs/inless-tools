#!/usr/bin/env node

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const DEFAULT_DIR = 'dist';

const workDir = process.cwd();
const pkgFilename = 'package.json';
const pkg = require(path.join(workDir, pkgFilename));

const distDirname = (pkg.inless && pkg.inless.dist) || DEFAULT_DIR;
const files = fs.readdirSync(workDir);

const exclude = [pkgFilename, distDirname, '.git', '.gitignore', 'node_modules', 'yarn.lock'];

files.forEach(file => {
    if (exclude.indexOf(file) === -1) fse.removeSync(path.join(workDir, file));
});
fse.moveSync(path.join(workDir, distDirname), workDir);
