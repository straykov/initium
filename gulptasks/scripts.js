const gulp    = require('gulp');
const plumber = require('gulp-plumber');
const uglify  = require('gulp-uglify');
const concat  = require('gulp-concat');
const eslint  = require('gulp-eslint');
const babel   = require("gulp-babel");
const paths   = require('./paths');
const errorHandler = require('./utils').onError;

// Сборка и минификация скриптов
function scripts() {
  return gulp
    .src(paths.scripts + '*.js')
    .pipe(plumber({errorHandler}))
    .pipe(eslint.format())
    .pipe(babel())
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js));
}

gulp.task(scripts);
