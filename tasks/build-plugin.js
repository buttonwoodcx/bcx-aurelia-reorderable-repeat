const gulp = require('gulp');
const gulpif = require('gulp-if');
const gulpSourcemaps = require('gulp-sourcemaps');
const {buildJs, buildCss} = require('./build');
const merge2 = require('merge2');
const {isProduction, pluginOutputDir} = require('./_env');

function buildPlugin() {
  return merge2(
    gulp.src('src/**/*.{json,html}', {since: gulp.lastRun(buildPlugin)}),
    buildJs('src/**/*.js'),
    buildCss('src/**/*.css')
  )

  // Use gulp-sourcemaps instead of default gulp v4
  // to bypass a gulp issue.
  // https://github.com/gulpjs/gulp/issues/2288#issuecomment-506953894
  .pipe(gulpSourcemaps.write('.', {
    includeContent: true,
    sourceRoot: '../src/'
  }))
  .pipe(gulp.dest(pluginOutputDir));
}

module.exports = buildPlugin;

