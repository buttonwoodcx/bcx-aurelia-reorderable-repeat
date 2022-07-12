const gulp = require("gulp");
const devServer = require("./dev-server");
const clean = require("./clean");
const build = require("./build");

const serve = gulp.series(
  build,
  function startServer(done) {
    // Open a browser window when not in CI environment.
    devServer.run({
      port: 9000,
      open: !process.env.CI,
    });
    done();
  },
);

// Reload dev server
function reload(done) {
  console.log("Reloading the browser");
  devServer.reload();
  done();
}

// Watch all files for rebuild and reload dev server.
function watch() {
  gulp.watch("{src,dev-app}/**/*", gulp.series(build, reload));
}

module.exports = gulp.series(
  clean,
  serve,
  watch,
);
