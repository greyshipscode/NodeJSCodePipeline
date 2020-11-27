#! /usr/bin/env node
'use strict';

const cli = require('./cli');
const yargs = require('yargs/yargs');
const fs = require('fs');
const path = require('path');
const { hideBin } = require('yargs/helpers')

const argv = yargs(hideBin(process.argv)).argv;

const stackName = argv.name ? argv.name : argv.n ? argv.n : 'NodePipeline';
cli.setEnv('stack-name', stackName);

const dirString = path.dirname(fs.realpathSync(__filename));
cli.runDeploy(dirString);
