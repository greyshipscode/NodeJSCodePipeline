# NodeJSCodePipeline

Using the CDK to create a fully managed AWS development environment.

This script will create a sample git repository with a full NodeJS continuous delivery pipeline attached. The pipeline will build and test new commits, send configurable email updates, and with manual approval will deploy your code to production. The resources created in production will be fully managed infrastructure-as-code stored in a CloudFormation stack.

## Useful commands

 * `npm run test`         perform the jest unit tests
 * `cdk deploy`           deploy this stack to your default AWS account/region
 * `cdk diff`             compare deployed stack with current state
 * `cdk synth`            emits the synthesized CloudFormation template
