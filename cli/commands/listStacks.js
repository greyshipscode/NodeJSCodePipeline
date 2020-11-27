const { spawn } = require('child_process');

module.exports = (dir) => {
  return new Promise((resolve, reject) => {
    const runDeploy = spawn(dir + '/node_modules/aws-cdk/bin/cdk', ['list'], {
      cwd: dir
    });

    runDeploy.stdout.on('data', (data) => {
      console.info(`aws-node-pipeline: ${data}`);
    });

    runDeploy.stderr.on('data', (data) => {
      console.error(`[LIST]: ${data}`);
    });

    runDeploy.on('error', (error) => {
      reject(console.error("Unable to spawn child process."));
    });

    runDeploy.on('close', (code) => {
      switch(code) {
        case 1:
          console.error("[ERROR] aws-node-pipline: AWS CDK experienced an error during operation.");
          return reject(new Error("CDK Error"));
        case 0:
          return resolve();
        default:
          console.error("[ERROR] aws-node-pipeline: Child process exited with status code " + code);
          return reject(new Error("Child Process Error"));
      }
    });
  });
}
