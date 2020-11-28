const { spawn } = require('child_process');

module.exports = (cmd, args, dir) => {
    const runDeploy = spawn(dir.toString() + cmd.toString(), args, {
      cwd: dir,
      detached: true,
      stdio: "inherit"
    });

    runDeploy.on('error', (error) => {
      reject(console.error("node_js_code_pipeline: Unable to spawn child process."));
    });

    runDeploy.on('close', (code) => {
      switch(code) {
        case 1:
          console.error("[ERROR] node_js_code_pipeline: AWS CDK experienced an error during operation.");
          throw new Error("CDK Error");
        case 0:
          console.info("node_js_code_pipeline: Operation completed successfully.");
          return true;
        default:
          console.error("[ERROR] node_js_code_pipeline: Child process exited with status code " + code);
          throw new Error("Child Process Error");
      }
    });

    process.on('exit', () => {
      runDeploy.kill();
    });
}
