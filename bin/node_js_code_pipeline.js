#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { NodeJsCodePipelineStack } = require('../lib/node_js_code_pipeline-stack');

const app = new cdk.App();
new NodeJsCodePipelineStack(app, 'NodeJsCodePipelineStack');
