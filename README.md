# NodeJSCodePipeline

Uses the CDK to create a fully managed AWS development environment.

This script will create a sample git repository with a full NodeJS continuous delivery pipeline attached. The pipeline will build and test new commits, send configurable email updates, and with manual approval will deploy your code to production. The resources created in production will be fully managed infrastructure-as-code stored in a CloudFormation stack.

## Installation

1. Clone this repository or install it via npm.
2. Install the AWS CDK Toolkit via npm.
`npm install -g aws-cdk@1.74.0`
3. Install the project's dependencies from project directory.
`npm install`

You're ready to rock!

## Build

"Build" the project and synthesize the various JavaScript code into a CloudFormation template on the console for spot-checking with this command:
`npm run build`

## Tests

This project is protected by a suite of automated tests to ensure that all resources will be created according to plan.

Run the tests from the project directory via:
`npm run test`

## Usage

The naming of all resources created by this script are set by the environment variable NodeJSCodePipelineStack. You may set it in most shell environments like so:
`export NodeJSCodePipelineStack=MyAppName`

Otherwise, a default value of NodeJSAutomatedSDLC will be used, as I assume you are only using for testing purposes.

You may then deploy a new stack using the following command:
`npm run deploy`

To deploy many pipelines, simply trigger a new deployment each time you update your NodeJSCodePipelineStack.

## Cleanup

To clean up any of the resources created by this script, you may use the AWS CLI. Your CloudFormation stack's name will be set to the value of NodeJSCodePipelineStack when you deployed it.
`aws cloudformation delete-stack --stack-name YOUR_STACK_NAME`
