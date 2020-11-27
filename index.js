#! /usr/bin/env node
'use strict';
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const dirString = path.dirname(fs.realpathSync(__filename));

process.env['@greyshipscode/aws-node-pipeline/stack-name'] = 'FakeName';

const runDeploy = spawn(dirString + '/node_modules/aws-cdk/bin/cdk', ['deploy', '--require-approval', 'never'], {
    cwd: dirString
});

runDeploy.stdout.on('data', (data) => {
  console.info(`aws-node-pipeline: ${data}`);
});

runDeploy.stderr.on('data', (data) => {
  console.error(`[DEPLOYMENT]: ${data}`);
});

runDeploy.on('error', (error) => {
  console.error("Unable to spawn child process.");
});

runDeploy.on('close', (code) => {
  switch(code) {
    case 1:
      return console.error("[ERROR] aws-node-pipline: AWS CDK experienced an error during deployment.");
    case 0:
      return console.info("aws-node-pipeline: Deployment completed successfully.");
    default:
      return console.error("[ERROR] aws-node-pipeline: Child process exited with status code " + code);
  }
});
