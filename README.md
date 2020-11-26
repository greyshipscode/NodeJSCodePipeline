# NodeJSCodePipeline
![dev-version](https://img.shields.io/github/package-json/v/greyshipscode/NodeJSCodePipeline)
![npm-version](https://img.shields.io/npm/v/@greyshipscode/node_js_code_pipeline)
![cdk-version](https://img.shields.io/github/package-json/dependency-version/greyshipscode/NodeJSCodePipeline/aws-cdk)

NodeJSCodePipeline is a CLI utility for quickly generating an automated NodeJS SDLC in AWS.

### Features
* Creates a NodeJS continuous delivery pipeline attached to a git repo with one command
* Build, test and deploy new commits automatically
* Includes manual approvals prior to automated production deploy
* All resources are fully managed infrastructure-as-code backed by a CloudFormation Stack

### Under Development
* Automated integration test harness
* Configurable email & sms updates

## Getting Started

1. Install this package via npm.
`npm install -g @greyshipscode/node_js_code_pipeline`
2. Ensure that your AWS Credentials are set in your environment.

You may use the commands below to set your AWS credentials, replacing the values given with your id and secret.

### Linux/MacOS
```
export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
export AWS_DEFAULT_REGION=us-west-2
```

### Powershell
```
$Env:AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
$Env:AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
$Env:AWS_DEFAULT_REGION="us-west-2"
```

## Usage

You may run the script by running the following command:
`node_js_code_pipeline`

This will create a stack with the default name, parameters and templates. This is currently alpha software, further options will be enabled as parameters from the CLI as development continues. This guide will be updated periodically with new features.

## Working With Your New Stack
> :warning: **DISCLAIMER!** The deployment environments created by this script are __not intended for production use.__ 

This tool is intended to enable you to set up multiple continuous delivery pipelines for NodeJS as quickly as possible. *BEFORE* you deploy your app to production, you should customize the CloudFormation Template of your stack.

### Pushing Your First Commit
Once your stack is created, you can trigger the pipeline by pushing your first commit to your primary branch. In order to deploy succesfully, your app needs just a few things:
* Valid `package.json` including scripts: `build` & `test`
* Valid `appspec.yml` and lifecycle scripts

For convenience, I have developed [a sample application](https://github.com/greyshipscode/NodeJSCodePipeline-SampleApp) with the absolute bare minimum to complete each stage of the pipeline successfully. To get started immediately:

```
git clone https://github.com/greyshipscode/NodeJSCodePipeline-SampleApp.git
cd NodeJSCodePipeline-SampleApp.git
git remote set-url origin https://<GIT_REPO_URL>
git push -f
```

You will be asked to provide your git credentials.

> For more information on AWS git credentials and CodeCommit, check out [the official documentation](https://docs.aws.amazon.com/codecommit/latest/userguide/setting-up-gc.html).

## Cleanup

To clean up all of the resources created by this script, you just have to delete the backing CloudFormation stack. Your stack's name will be set to the value of NodeJSCodePipelineStack when you deployed it.

### AWS CLI

List all cloudformation stacks:
`aws cloudformation list-stacks`

Delete the stack created by NodeJSCodePipeline:
`aws cloudformation delete-stack --stack-name YOUR_STACK_NAME`
