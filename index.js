#! /usr/bin/env node
'use strict';
const { exec } = require("child_process");
const fs = require('fs');
const path = require('path');

const dirString = path.dirname(fs.realpathSync(__filename));

exec("./node_modules/aws-cdk/bin/cdk deploy --require-approval never", {cwd: dirString}, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
