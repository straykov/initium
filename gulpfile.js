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

// Пути к ресурсам проекта
var paths = {
  styles: 'assets/source/styles/',
  css: 'assets/css/',
  scripts: 'assets/source/scripts/',
  js: 'assets/js/',
  html: ''
}

// Сборка проекта
gulp.task('default', function() {
  gulp.start('styles', 'nanocss', 'scripts');
});

// Сборка проекта c авторефрешем
gulp.task('live', function() {
  gulp.start('connect', 'styles', 'nanocss', 'scripts', 'watch');
});

gulp.task('watch', function() {
  gulp.watch(paths.styles + '*.styl', ['styles']);
  gulp.watch(paths.css + '*.css', ['nanocss']);
  gulp.watch(paths.scripts + '*.js', ['scripts']);
  gulp.watch(paths.html + '*.html', ['html']);
});

// ЦСС
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

// Минифицируем ЦСС
gulp.task('nanocss', function () {
  return gulp.src(paths.css + '*.css')
    .pipe(nano())
    .pipe(gulp.dest(paths.css))
});

// Собираем скрипты в один файл и минифицируем
gulp.task('scripts', function() {
  return gulp.src(paths.scripts + '*.js')
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js))
    .pipe(connect.reload());
});

// Запускаем локальный сервер
gulp.task('connect', function() {
  connect.server({
    root: '.',
    port: 7778,
    livereload: true
  });
});

// Обновляем страницу при измении ХТМЛ
gulp.task('html', function () {
  gulp.src(paths.html + '*.html')
    .pipe(connect.reload());
});

// Ловим ошибки
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}
