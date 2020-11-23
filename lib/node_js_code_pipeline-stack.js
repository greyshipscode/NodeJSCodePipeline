const cdk = require('@aws-cdk/core');
const codeCommit = require('@aws-cdk/aws-codecommit');
const stackName = require('./stack_name');

class NodeJsCodePipelineStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);
    const repo = new codeCommit.Repository(this, 'Repository' ,{
      repositoryName: stackName,
      description: `A repository with attached continous delivery managed by ${stackName}.`,
    });
  }
}

module.exports = { NodeJsCodePipelineStack }
