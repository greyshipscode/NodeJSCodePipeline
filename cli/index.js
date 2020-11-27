//This file defines the CLI behavior of the library and wraps the CDK

//COMMANDS: Expose the underlying CDK commands to the index handler
module.exports.commands     = require('./commands');

//HELPERS: Utilities that offload tasks from the index handler
module.exports.setEnv        = require('./setEnv');
