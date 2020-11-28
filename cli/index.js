//This file defines the CLI behavior of the library and wraps the CDK

//USER DEPENDENCIES
const command   = require('./command');

//Export class, must be instantiated with `new`
module.exports  = class CLI {
  constructor(dir) {
    this.dir = dir;
    this.cdk = '/node_modules/aws-cdk/bin/cdk';
  }

  //LIFECYCLE METHODS: These commands create, list, update or destroy resources in your AWS account
  listStacks() {
    return command(this.cdk, ['list'], this.dir);
  }

  deployStack(stack) {
    return command(this.cdk, ['deploy', '--require-approval', 'never'], this.dir);
  }

  destroyStack(stack) {
    return command(this.cdk, ['destroy', stack, '--require-approval', 'never'], this.dir);
  }

  //HELPERS: These commands set up other resources required by the utility
  setEnv(key, value) {
    process.env['@greyshipscode/aws-node-pipeline/'+ key] = value;
  };

  setup() {
    return command(this.cdk, ['bootstrap'], this.dir);
  }
};

