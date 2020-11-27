# NodeJSCodePipeline
![cdk-version](https://img.shields.io/github/package-json/dependency-version/greyshipscode/NodeJSCodePipeline/aws-cdk)
![npm-version](https://img.shields.io/npm/v/@greyshipscode/node_js_code_pipeline)
![npm-downloads](https://img.shields.io/npm/dt/@greyshipscode/node_js_code_pipeline)

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
3. Run the first-time setup script.
`node_js_code_pipeline setup`

### Setting Your AWS Credentials
You may use the commands below to set your AWS credentials, replacing the values given with your id and secret.

>### Linux/MacOS
>```
>export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
>export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
>export AWS_DEFAULT_REGION=us-west-2
>```
>
>### Powershell
>```
>$Env:AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
>$Env:AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
>$Env:AWS_DEFAULT_REGION="us-west-2"
>```

## Usage

You may run the script by running the following command in your preferred shell:
```
node_js_code_pipeline [command][-options]
```

### Commands

Commands may be issued one at a time, and may be specified like: `node_js_code_pipeline list`

#### Stack Lifecycle Actions
* __Default:__ With no command (or an unrecognized command), this tool will attempt to deploy a new stack.
* `l` or `list`: List the CDK stacks deployed to this aws account.
* `d` or `destroy`: Attempt to destroy the stack specified via `-n` option. You will be asked for confirmation.

#### Other Commands
* `s` or `setup`: Sets up the required resources for AWS's CDK in your AWS account.

### Options

Options may be specified like so: `node_js_code_pipeline -n TestSDLCStack`

* `-n` or `--name`: Sets the target stack name. If you are creating a stack, it will be named this.

## Working With Your New Stack
> :warning: **DISCLAIMER!** The deployment environments created by this script are __not intended for production use.__ 

This tool is intended to enable you to set up multiple continuous delivery pipelines for NodeJS as quickly as possible. *BEFORE* you deploy your app to production, you should customize the CloudFormation Template of your stack.

### Pushing Your First Commit
Once your stack is created, you can trigger the pipeline by pushing your first commit to your primary branch. In order to deploy succesfully, your app needs just a few things:
* Valid `package.json` including scripts: `build` & `test`
* Valid `appspec.yml` and lifecycle scripts

For convenience, I have developed [a sample application](https://github.com/greyshipscode/NodeJSCodePipeline-SampleApp) with the absolute bare minimum to complete each stage of the pipeline successfully. To get started immediately, simply replace `<GIT_REPO_URL>` in the below shell script with the git URL for your new repository:

```
git clone https://github.com/greyshipscode/NodeJSCodePipeline-SampleApp.git
cd NodeJSCodePipeline-SampleApp
git remote set-url origin https://<GIT_REPO_URL>
git push -f
```

You will be asked to provide your git credentials.

> For more information on AWS git credentials and CodeCommit, check out [the official documentation](https://docs.aws.amazon.com/codecommit/latest/userguide/setting-up-gc.html).

### Cleanup

To clean up all of the resources created by a stack, you just have to delete the underlying CloudFormation stack. For convenience, I have provided a wrapper around the CDK methods that provide this functionality. You may use the following commands:

List all stacks:

`node_js_code_pipeline l` or `node_js_code_pipeline list`

> :warning: Please note that at the present time, all CDK stacks in the aws account will be displayed. [A fix is under development.](https://github.com/greyshipscode/NodeJSCodePipeline/issues/9)

Delete a stack by name:

`node_js_code_pipeline d -n <STACK_NAME>` or `node_js_code_pipeline delete -n <STACK_NAME>`
