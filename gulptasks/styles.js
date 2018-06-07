const gulp         = require('gulp');
const plumber      = require('gulp-plumber');
const stylus       = require('gulp-stylus');
const postcss      = require('gulp-postcss');
const duration     = require('gulp-duration');
const errorHandler = require('./utils').onError;
const paths        = require('./paths');

const processors = [
  require('precss'),
  require('postcss-inline-svg'),
  require('autoprefixer'),
  require('css-mqpacker'),
];


// Сборка стилей
function styles() {
  return gulp
    .src(paths.styles + '*.styl')
    .pipe(plumber({errorHandler}))
    .pipe(postcss(processors))
    .pipe(duration(`style.css has built`))
    .pipe(gulp.dest(paths.css));
}

gulp.task(styles);
