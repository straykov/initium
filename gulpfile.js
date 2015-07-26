'use strict';

var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer-core'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    nano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect');

// Ресурсы проекта
var paths = {
  styles: 'assets/source/styles/',
  css: 'assets/css/',
  scripts: 'assets/source/scripts/',
  js: 'assets/js/',
  html: ''
}

// Одноразовая сборка проекта
gulp.task('default', function() {
  gulp.start('styles', 'nanocss', 'scripts');
});

// Запуск живой сборки
gulp.task('live', function() {
  gulp.start('connect', 'styles', 'nanocss', 'scripts', 'watch');
});

gulp.task('watch', function() {
  gulp.watch(paths.styles + '*.styl', ['styles']);
  gulp.watch(paths.css + '*.css', ['nanocss']);
  gulp.watch(paths.scripts + '*.js', ['scripts']);
  gulp.watch(paths.html + '*.html', ['html']);
});

// Компиляция стилей, добавление префиксов
gulp.task('styles', function () {
  var processors = [
    autoprefixer({browsers:['last 3 versions', '> 1%', 'IE 8']})
  ];

  return gulp.src(paths.styles + 'layout.styl')
  .pipe(stylus())
  .pipe(rename('style.css'))
  .pipe(postcss(processors))
  .pipe(gulp.dest(paths.css))
  .pipe(connect.reload());
});

// Сжатие ЦСС
gulp.task('nanocss', function () {
  return gulp.src(paths.css + '*.css')
  .pipe(nano())
  .pipe(gulp.dest(paths.css))
});

// Сборка и минификация скриптов
gulp.task('scripts', function() {
  return gulp.src(paths.scripts + '*.js')
  .pipe(concat('scripts.js'))
  .pipe(uglify())
  .pipe(gulp.dest(paths.js))
  .pipe(connect.reload());
});

// Запуск локального сервера
gulp.task('connect', function() {
  connect.server({
    root: '.',
    port: 7778,
    livereload: true
  });
});

// Рефреш ХТМЛ-страниц
gulp.task('html', function () {
  gulp.src(paths.html + '*.html')
  .pipe(connect.reload());
});

// Ошибки
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}
