const cdk = require('@aws-cdk/core');

const codeCommit = require('@aws-cdk/aws-codecommit');
const codeBuild = require('@aws-cdk/aws-codebuild');
const codeDeploy = require('@aws-cdk/aws-codedeploy');
const codePipeline = require('@aws-cdk/aws-codepipeline');
const cpActions = require('@aws-cdk/aws-codepipeline-actions');

const ec2 = require('@aws-cdk/aws-ec2');
const autoScaling = require('@aws-cdk/aws-autoscaling');
const elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');

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

    //create sdlc resources
    this.repository = this.createRepo();
    this.pipeline = this.createPipeline();
    this.project = this.createProject();

    //create network resources
    this.vpc = this.createVPC();
    this.qaListener = this.createLoadBalancer('QA', this.vpc);
    this.prodListener = this.createLoadBalancer('Prod', this.vpc);

    //create deployment resources
    this.qaAsg = this.createAutoScalingGroup('QA', this.vpc);
    this.prodAsg = this.createAutoScalingGroup('PROD', this.vpc);
    this.qaDeploymentGroup = this.createDeploymentGroup(this.qaAsg, 'QA');
    this.prodDeploymentGroup = this.createDeploymentGroup(this.prodAsg, 'Prod');

    //attach load balancers to deployment resources
    this.qaListener.addTargets('QAApplicationFleet', {
      port: 80,
      targets: [this.qaAsg]
    });
    this.prodListener.addTargets('ProdApplicationFleet', {
      port: 80,
      targets: [this.prodAsg]
    });

    const buildStages = this.createBuildStages();
  }

  createRepo() {
    return new codeCommit.Repository(this, stackName + 'Repository', {
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

  createApp(env) {
    return new codeDeploy.ServerApplication(this, stackName + env + 'App', {
      applicationName: stackName + env,
    });
  }

  createVPC() {
    return new ec2.Vpc(this, stackName + 'VPC');
  }

  createLoadBalancer(env, vpc) {
    const lb = new elbv2.ApplicationLoadBalancer(this, env + 'LB', {
      vpc,
      internetFacing: true
    });
    return lb.addListener('Listener', {
      port: 80,
      open: true,
    });
  }

  createAutoScalingGroup(env, vpc) {
    return new autoScaling.AutoScalingGroup(this, stackName + env + 'ASG', {
      vpc: vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux({generation:ec2.AmazonLinuxGeneration.AMAZON_LINUX_2}),
      minCapacity: 1,
      maxCapacity: 3
    });
  }

  createDeploymentGroup(asg, env) {
    return new codeDeploy.ServerDeploymentGroup(this, stackName + env + 'DeploymentGroup', {
      deploymentGroupName: stackName + env,
      autoScalingGroups: [asg],
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
    const sourceStage = this.pipeline.addStage({stageName: "SourceCommit"});
    const sourceOutput = this.addSourceAction(sourceStage);

    const buildStage = this.pipeline.addStage({stageName: "BuildCommit"});
    const buildOutput = this.addBuildAction(buildStage, sourceOutput);

    const qaDeploymentStage = this.pipeline.addStage({stageName: "QADeployment"});
    const qaOutput = this.addDeploymentAction("QA", this.qaDeploymentGroup, qaDeploymentStage, buildOutput);

    const approvalStage = this.pipeline.addStage({stageName: "ManualApproval"});
    this.addApprovalAction(approvalStage, "CodeReview");
    this.addApprovalAction(approvalStage, "AcceptanceTesting");

    const prodDeploymentStage = this.pipeline.addStage({stageName: "ProdDeployment"});
    const prodOutput = this.addDeploymentAction("PROD", this.prodDeploymentGroup, prodDeploymentStage, buildOutput);

    return { sourceStage, buildStage, qaDeploymentStage };
  }

  addSourceAction(stage) {
    const output = new codePipeline.Artifact();
    const action = new cpActions.CodeCommitSourceAction({
      branch: 'main',
      actionName: 'CommitToMaster',
      repository: this.repository,
      output: output,
    });
    stage.addAction(action);
    return output;
  }

  addBuildAction(stage, input) {
    const output = new codePipeline.Artifact();
    const action = new cpActions.CodeBuildAction({
      actionName: 'BuildAndTest',
      project: this.project,
      input: input,
      outputs: [output]
    });
    stage.addAction(action);
    return output;
  }

  addDeploymentAction(env, deploymentGroup, stage, input) {
    const action = new cpActions.CodeDeployServerDeployAction({
      actionName: env + 'Deployment',
      deploymentGroup: deploymentGroup,
      input,
    });
    stage.addAction(action);
  }

  addApprovalAction(stage, name) {
    const action = new cpActions.ManualApprovalAction({
      actionName: name
    });
    stage.addAction(action);
  }
}

module.exports = { NodeJsCodePipelineStack }
