#! /usr/bin/env node
'use strict';

const cli = require('./cli');
const fs = require('fs');
const path = require('path');

cli.setEnv('stack-name', 'FakeName');

const dirString = path.dirname(fs.realpathSync(__filename));
cli.runDeploy(dirString);
