const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const NodeJsCodePipeline = require('../lib/node_js_code_pipeline-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new NodeJsCodePipeline.NodeJsCodePipelineStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
