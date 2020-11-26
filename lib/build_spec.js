module.exports = {
  version: '0.2',
  artifacts: {
    files: '**/*'
  },
  phases: {
    install: {
      commands: [
        'npm install'
      ]
    },
    build: {
      commands: [
        'npm build'
      ]
    },
    pre_build: {},
    post_build: {
      commands: [
        'npm test'
      ]
    },
  },
};
