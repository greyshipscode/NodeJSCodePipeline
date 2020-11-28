#! /usr/bin/env node
'use strict';

const cli = require('./cli');
const yargs = require('yargs/yargs');
const fs = require('fs');
const path = require('path');
const { hideBin } = require('yargs/helpers')

const argv = yargs(hideBin(process.argv)).argv;
const dirString = path.dirname(fs.realpathSync(__filename));

const stackName = argv.name ? argv.name : argv.n ? argv.n : 'NodePipeline';
cli.setEnv('stack-name', stackName);

const executeCommand = async(command = 'default') => {
  switch(command.toLowerCase().trim()) {
    case "setup":
    case "s":
      return cli.commands.setup(dirString);
    //Stack Lifecycle Actions
    case "list":
    case "l":
      return cli.commands.listStacks(dirString);
    case "destroy":
    case "d":
      return await cli.commands.destroyStack(dirString, stackName);
    default:
      return cli.commands.deployStack(dirString);
  }
};

const nonFlags = argv._.length;
if(nonFlags === 0) {
  //execute default command
  return executeCommand();
} else if (nonFlags === 1) {
  //parse argv._ for command and execute
  return executeCommand(argv._[0]);
} else {
  //bad syntax
  return console.error('aws-node-pipeline: Improper command syntax. You may input up to one command and unlimited options.');
}

