const gulp  = require('gulp');
const cache = require('gulp-cached');
const image = require('gulp-imagemin');
const paths = require('./paths');

// Сжатие картинок
function img() {
  return gulp
    .src(paths.img + '/**/*.{png,jpg,gif,svg}')
    .pipe(cache('img'))
    .pipe(image({verbose: true}))
    .pipe(gulp.dest(paths.bundles));
}

gulp.task(img);
