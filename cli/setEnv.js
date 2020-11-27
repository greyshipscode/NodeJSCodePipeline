module.exports = (key, value) => {
  process.env['@greyshipscode/aws-node-pipeline/'+ key] = value;
};
