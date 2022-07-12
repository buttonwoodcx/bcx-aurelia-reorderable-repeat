const gulp = require("gulp");
const gulpif = require("gulp-if");
const gulpSourcemaps = require("gulp-sourcemaps");
const { buildJs, buildCss } = require("./build");
const merge2 = require("merge2");
const { isProduction, pluginOutputDir } = require("./_env");

function pluginTask(tsOpts, subFolder) {
  return function () {
    return merge2(
      gulp.src("src/**/*.{json,html}"),
      buildJs("src/**/*.js", tsOpts),
      buildCss("src/**/*.css"),
    )
      // Use gulp-sourcemaps instead of default gulp v4
      // to bypass a gulp issue.
      // https://github.com/gulpjs/gulp/issues/2288#issuecomment-506953894
      .pipe(gulpSourcemaps.write(".", {
        includeContent: true,
        sourceRoot: "../src/",
      }))
      .pipe(gulp.dest(pluginOutputDir + "/" + subFolder));
  };
}

module.exports = gulp.series(
  pluginTask({ target: "es5", module: "commonjs" }, "commonjs"),
  pluginTask({ target: "es5", module: "esnext" }, "native-modules"),
  pluginTask({ target: "es2015", module: "es2015" }, "es2015"),
  pluginTask({ target: "es2017", module: "es2015" }, "es2017"),
);
