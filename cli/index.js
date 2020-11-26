#! /usr/bin/env node
'use strict';
const { exec } = require("child_process");

exec("./node_modules/aws-cdk/bin/cdk deploy --require-approval never", (error, stdout, stderr) => {
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
