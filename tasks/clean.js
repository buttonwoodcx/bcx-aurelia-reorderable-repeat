const del = require('del');
const {outputDir, pluginOutputDir} = require('./_env');

module.exports = function() {
  return del([outputDir, pluginOutputDir]);
}
