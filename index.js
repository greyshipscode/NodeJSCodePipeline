#! /usr/bin/env node
'use strict';
//This file is the entry point from the CLI

//CORE DEPENDENCIES
const fs        = require('fs');
const path      = require('path');
//NPM DEPENDENCIES
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
//USER DEPENDENCIES
const CLI = require('./cli');

//PRIVATE METHODS
const getDirectory = () => {
  return path.dirname(fs.realpathSync(__filename));
};

//EMIT EXIT EVENT ON KILL
var cleanExit = function() { process.exit() };
process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);

//INSTANTIATION
const dir = getDirectory();
const cli = new CLI(dir);
const argv = yargs(hideBin(process.argv)).argv;

const stackName = argv.name ? argv.name : argv.n ? argv.n : 'NodePipeline';
cli.setEnv('stack-name', stackName);

//Convert flag input to execution action
const executeCommand = async(command = 'default') => {
  switch(command.toLowerCase().trim()) {
    case "setup":
    case "s":
      return cli.setup();
    //Stack Lifecycle Actions
    case "list":
    case "l":
      return cli.listStacks();
    case "destroy":
    case "d":
      return cli.destroyStack(stackName);
    default:
      return cli.deployStack(dir);
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
