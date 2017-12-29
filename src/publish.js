const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const rmdir = require('./rmdir');

const build = (workDir, buildDir) => {
    const tsConfig = require(path.join(workDir, 'tsconfig.json'));
    const tsConfigTempPath = path.join(workDir, '_inless_publish_tsconfig.json');

    tsConfig.compilerOptions.outDir = buildDir;
    tsConfig.compilerOptions.declaration = true;
    tsConfig.compilerOptions.sourceMap = true;
    tsConfig.compilerOptions.allowJs = false;
    tsConfig.compilerOptions.module = "commonjs";

    console.log(`Making temp typescript config at ${tsConfigTempPath}...`);
    fs.writeFileSync(tsConfigTempPath, JSON.stringify(tsConfig, null, 4));

    if (shell.exec(`${path.join(workDir, 'node_modules/.bin/tsc')} -p ${tsConfigTempPath}`).code !== 0) {
        console.log(`[ERROR] Building failed`);
        shell.exec(`rm ${tsConfigTempPath}`);
        shell.exit(1);
        return false;
    }

    shell.exec(`rm ${tsConfigTempPath}`);
    console.log(`[OK] Built successful`);
    return true;
};

const publish = (workDir) => {
    const pkg = require(path.join(workDir, 'package.json'));
    if (!pkg.inless || !pkg.inless.dist) throw new Error('Package must contain inless config');

    const buildDir = path.join(workDir, '_inless_temp_build');

    pkg.main = pkg.inless.main || 'index.js';
    pkg.types = pkg.inless.types || 'index.d.ts';

    shell.rm('-rf', buildDir);
    fs.mkdirSync(buildDir);

    if(!build(workDir, buildDir)) {
        console.log('[ERROR] Oh my bad. You\'ve suck');
        return;
    }

    console.log(`copying package.json to ${buildDir}...`);
    fs.writeFileSync(path.join(buildDir, 'package.json'), JSON.stringify(pkg, null, 4));

    console.log(`cd to ${buildDir}...`);
    shell.cd(buildDir);
    
    console.log(`publishing ${pkg.name}@${pkg.version}...`);
    if (shell.exec('npm publish').code !== 0) {
        console.log(`[ERROR] Publishing failed`);
        shell.exit(1);
    }

    shell.exec(`rm --rf ${buildDir}`);
    shell.exit(0);
    console.log(`[OK] Published successfuly`);
};

exports.publish = publish;
