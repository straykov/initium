'use strict';

var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer-core'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    nano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    portfinder = require('portfinder'),
    browserSync = require("browser-sync"),
    include = require("gulp-html-tag-include"),
    reload = browserSync.reload;

// Ресурсы проекта
var paths = {
  styles: 'assets/source/styles/',
  css: 'assets/css/',
  scripts: 'assets/source/scripts/',
  js: 'assets/js/',
  templates: 'templates/',
  html: ''
};

// Одноразовая сборка проекта
gulp.task('default', function() {
  gulp.start('include', 'styles', 'nanocss', 'scripts');
});

// Запуск живой сборки
gulp.task('live', function() {
  gulp.start('server', 'include', 'styles', 'nanocss', 'scripts', 'watch');
});

// Туннель
gulp.task('external-world', function() {
  gulp.start('web-server', 'include', 'styles', 'nanocss', 'scripts', 'watch');
});

// Федеральная служба по контролю за оборотом файлов
gulp.task('watch', function() {
  gulp.watch(paths.styles + '*.styl', ['styles']);
  gulp.watch(paths.css + '*.css', ['nanocss']);
  gulp.watch(paths.scripts + '*.js', ['scripts']);
  gulp.watch(paths.templates + '*.html', ['include', 'html']);
  gulp.watch(paths.templates + 'blocks/*.html', ['include', 'html']);
});

// Шаблонизация
gulp.task('include', function() {
  return gulp.src(paths.templates + '*.html')
  .pipe(include())
  .pipe(gulp.dest(paths.html));
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
  .pipe(reload({stream: true}));
});

// Сжатие ЦСС
gulp.task('nanocss', function () {
  return gulp.src(paths.css + '*.css')
  .pipe(nano())
  .pipe(gulp.dest(paths.css));
});

// Сборка и минификация скриптов
gulp.task('scripts', function() {
  return gulp.src(paths.scripts + '*.js')
  .pipe(concat('scripts.js'))
  .pipe(uglify())
  .pipe(gulp.dest(paths.js))
  .pipe(reload({stream: true}));
});

// Запуск локального сервера
gulp.task('server', function() {
  portfinder.getPort(function (err, port){
    browserSync({
      server: {
        baseDir: "."
      },
      host: 'localhost',
      notify: false,
      port: port
    });
  });
});

// Запуск локального сервера c туннелем
gulp.task('web-server', function() {
  portfinder.getPort(function (err, port){
    browserSync({
      server: {
        baseDir: "."
      },
      tunnel: true,
      host: 'localhost',
      notify: false,
      port: port
    });
  });
});

// Рефреш ХТМЛ-страниц
gulp.task('html', function () {
  gulp.src(paths.html + '*.html')
  .pipe(reload({stream: true}));
});

// Ошибки
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}
