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

    const repository = this.createRepo();
    const project = new codeBuild.PipelineProject(this, stackName + 'Project');
    const pipeline = new codePipeline.Pipeline(this, stackName + 'Pipeline', {
      pipelineName: stackName,
    });

    const sourceStage = pipeline.addStage({stageName: "SourceRepository"});
    const sourceOutput = this.addSourceAction(sourceStage, repository);

    const buildStage = pipeline.addStage({stageName: "BuildSource"});
    const buildOutput = this.addBuildAction(buildStage, project, sourceOutput);
  }

  createRepo() {
    return new codeCommit.Repository(this, stackName + 'Repository' ,{
      repositoryName: stackName,
      description: `A repository with attached continous delivery managed by ${stackName}.`,
    });
  }

  addSourceAction(stage, repo) {
    const output = new codePipeline.Artifact();
    const action = new cpActions.CodeCommitSourceAction({
      actionName: 'CodeCommit',
      repository: repo,
      output: output,
    });
    stage.addAction(action);
    return output;
  }

  addBuildAction(stage, project, input) {
    const output = new codePipeline.Artifact();
    const action = new cpActions.CodeBuildAction({
      actionName: 'CodeBuild',
      project: project,
      input: input,
      outputs: [output]
    });
    stage.addAction(action);
    return output;
  }
}

module.exports = { NodeJsCodePipelineStack }
