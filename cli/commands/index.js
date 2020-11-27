//This module exposes the underlying commands which operate the CDK framework

//LIFECYCLE SCRIPTS: These commands create, list, update or destroy resources in your AWS account
module.exports.deployStack  = require('./deployStack');
module.exports.listStacks   = require('./listStacks');
module.exports.destroyStack = require('./destroyStack');

//OTHER: These commands set up other resources required by the CDK
module.exports.setup        = require('./setup');
