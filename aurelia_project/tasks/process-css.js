import gulp from 'gulp';
import changedInPlace from 'gulp-changed-in-place';
import project from '../aurelia.json';
import {build} from 'aurelia-cli';

export default function processCSS() {
  return gulp.src(project.cssProcessor.source)
    .pipe(changedInPlace({firstPass: true}))
    .pipe(build.bundle());
}

// build plugin css files
// you need bit more than this if you use scss
export function pluginCSS() {
  return gulp.src(project.plugin.source.css)
    .pipe(gulp.dest(project.plugin.output));
}
