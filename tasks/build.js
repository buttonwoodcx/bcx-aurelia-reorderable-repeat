const gulp = require("gulp");
const ts = require("gulp-typescript");
const plumber = require("gulp-plumber");
const merge2 = require("merge2");
const gulpif = require("gulp-if");

const { isProduction, isTest, outputDir } = require("./_env");
const dr = require("./_dumber");

function buildJs(src, opts = {}) {
  const transpile = ts.createProject("tsconfig.json", {
    noEmitOnError: true,
    ...opts,
  });

  return gulp.src(src, { sourcemaps: true, since: gulp.lastRun(build) })
    .pipe(gulpif(!isProduction && !isTest, plumber()))
    .pipe(transpile());
}

function buildCss(src) {
  return gulp.src(src, { sourcemaps: true });
}

function build() {
  // Merge all js/css/html file streams to feed dumber.
  // Note scss was transpiled to css file by gulp-sass.
  // dumber knows nothing about .ts/.less/.scss/.md files,
  // gulp-* plugins transpiled them into js/css/html before
  // sending to dumber.
  return merge2(
    gulp.src(
      isTest
        ? ["{src,dev-app}/**/*.json", "test/**/*.json"]
        : "{src,dev-app}/**/*.json",
      { since: gulp.lastRun(build) },
    ),
    gulp.src(isTest ? "{src,dev-app}/**/*.html" : "{src,dev-app}/**/*.html", {
      since: gulp.lastRun(build),
    }),
    buildJs(
      isTest
        ? ["{src,dev-app}/**/*.js", "test/**/*.js"]
        : "{src,dev-app}/**/*.js",
    ),
    buildCss(isTest ? "{src,dev-app}/**/*.css" : "{src,dev-app}/**/*.css"),
  )
    // Note we did extra call `dr()` here, this is designed to cater watch mode.
    // dumber here consumes (swallows) all incoming Vinyl files,
    // then generates new Vinyl files for all output bundle files.
    .pipe(dr())
    .pipe(
      gulp.dest(outputDir, {
        sourcemaps: isProduction ? false : (isTest ? true : "."),
      }),
    );
}

module.exports = build;
module.exports.buildJs = buildJs;
module.exports.buildCss = buildCss;
