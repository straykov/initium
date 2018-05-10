const gulp        = require('gulp');
const cache       = require('gulp-cached');
const cachebust   = require('gulp-cache-bust');
const paths       = require('./paths.js');
const browserSync = require("browser-sync");
const reload      = browserSync.reload;

// Очистка кэша для скриптов и стилей
gulp.task('cache', function() {
  return gulp
    .src(paths.html + '*.html')
    .pipe(cachebust())
    .pipe(gulp.dest(paths.html))
    .pipe(reload({stream: true}));
});
