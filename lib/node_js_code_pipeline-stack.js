const cdk = require('@aws-cdk/core');

const codeCommit = require('@aws-cdk/aws-codecommit');
const codeBuild = require('@aws-cdk/aws-codebuild');
const codePipeline = require('@aws-cdk/aws-codepipeline');
const cpActions = require('@aws-cdk/aws-codepipeline-actions');

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

    const repository = new codeCommit.Repository(this, stackName + 'Repository' ,{
      repositoryName: stackName,
      description: `A repository with attached continous delivery managed by ${stackName}.`,
    });

    const project = new codeBuild.PipelineProject(this, stackName + 'Project');

    const pipeline = new codePipeline.Pipeline(this, stackName + 'Pipeline', {
      pipelineName: stackName,
    });

    const sourceStage = pipeline.addStage({stageName: "SourceRepository"});
    const sourceOutput = new codePipeline.Artifact();
    const sourceAction = new cpActions.CodeCommitSourceAction({
      actionName: 'CodeCommit',
      repository: repository,
      output: sourceOutput,
    });
    sourceStage.addAction(sourceAction);

    const buildStage = pipeline.addStage({stageName: "BuildSource"});
    const buildAction = new cpActions.CodeBuildAction({
      actionName: 'CodeBuild',
      project,
      input: sourceOutput,
      outputs: [new codePipeline.Artifact()], // optional
    });
    buildStage.addAction(buildAction);
  }
}

module.exports = { NodeJsCodePipelineStack }
