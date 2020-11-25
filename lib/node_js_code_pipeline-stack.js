const cdk = require('@aws-cdk/core');

const codeCommit = require('@aws-cdk/aws-codecommit');
const codeBuild = require('@aws-cdk/aws-codebuild');
const codeDeploy = require('@aws-cdk/aws-codedeploy');
const codePipeline = require('@aws-cdk/aws-codepipeline');
const cpActions = require('@aws-cdk/aws-codepipeline-actions');

const ec2 = require('@aws-cdk/aws-ec2');
const autoScaling = require('@aws-cdk/aws-autoscaling');

const stackName = require('./stack_name');
const buildSpec = require('./build_spec');

class NodeJsCodePipelineStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    this.repository = this.createRepo();
    this.pipeline = this.createPipeline();
    this.project = this.createProject();
    this.asg = this.createAutoScalingGroup();
    this.deploymentGroup = this.createDeploymentGroup(this.asg);

    const buildStages = this.createBuildStages();
  }

  createRepo() {
    return new codeCommit.Repository(this, stackName + 'Repository' ,{
      repositoryName: stackName,
      description: `A repository with attached continous delivery managed by ${stackName}.`,
    });
  }

  createPipeline() {
    return new codePipeline.Pipeline(this, stackName + 'Pipeline', {
      pipelineName: stackName,
    });
  }

  createProject() {
    return new codeBuild.PipelineProject(this, stackName + 'Project', {
      buildSpec: codeBuild.BuildSpec.fromObject(buildSpec),
      environment: {
        buildImage: codeBuild.LinuxBuildImage.STANDARD_2_0
      }
    });
  }

  createAutoScalingGroup() {
    const vpc = new ec2.Vpc(this, stackName + 'VPC');
    return new autoScaling.AutoScalingGroup(this, stackName + 'ASG', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      minCapacity: 3,
      maxCapacity: 5
    });
  }

  createDeploymentGroup(asg) {
    const application = new codeDeploy.ServerApplication(this, stackName + 'App', {
      applicationName: stackName,
    });
    return new codeDeploy.ServerDeploymentGroup(this, stackName + 'DeploymentGroup', {
      application,
      autoScalingGroups: [asg],
      deploymentGroupName: stackName,
      installAgent: true,
      ignorePollAlarmsFailure: false,
      autoRollback: {
          failedDeployment: true,
          stoppedDeployment: true,
          deploymentInAlarm: false,
      },
    });
  }

  createBuildStages() {
    const sourceStage = this.pipeline.addStage({stageName: "SourceRepository"});
    const sourceOutput = this.addSourceAction(sourceStage);

    const buildStage = this.pipeline.addStage({stageName: "BuildSource"});
    const buildOutput = this.addBuildAction(buildStage, sourceOutput);

    const qaDeploymentStage = this.pipeline.addStage({stageName: "QADeployment"});
    const qaOutput = this.addQADeploymentAction(qaDeploymentStage, buildOutput);

    return { sourceStage, buildStage, qaDeploymentStage };

  }

  addSourceAction(stage) {
    const output = new codePipeline.Artifact();
    const action = new cpActions.CodeCommitSourceAction({
      actionName: 'CodeCommit',
      repository: this.repository,
      output: output,
    });
    stage.addAction(action);
    return output;
  }

  addBuildAction(stage, input) {
    const output = new codePipeline.Artifact();
    const action = new cpActions.CodeBuildAction({
      actionName: 'CodeBuild',
      project: this.project,
      input: input,
      outputs: [output]
    });
    stage.addAction(action);
    return output;
  }

  addQADeploymentAction(stage, input) {
    const action = new cpActions.CodeDeployServerDeployAction({
      actionName: 'QADeployment',
      deploymentGroup: this.deploymentGroup,
      input,
    });
    stage.addAction(action);
  }
}

module.exports = { NodeJsCodePipelineStack }
