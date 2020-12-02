module.exports = {
  version: '0.2',
  artifacts: {
    files: [
      'deploy/*',
      'node-app',
      'appspec.yml'
    ]
  },
  phases: {
    install: {
      commands: [
        'npm install',
        'npm install -g pkg'
      ]
    },
    build: {
      commands: [
        'npm build',
        'npm test'
      ]
    },
    pre_build: {},
    post_build: {
      commands: [
        'pkg --targets node12-linux-x64 --output node-app .'
      ]
    },
  },
};
