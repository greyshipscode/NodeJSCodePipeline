module.exports = {
  version: '0.2',
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
  artifacts: {
    files: [
      '*',
    ]
  }
};
