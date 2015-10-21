'use strict';

var gulp = require('gulp'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    portfinder = require('portfinder'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    nested = require("postcss-nested"),
    cssnext = require("gulp-cssnext"),
    vars = require('postcss-simple-vars'),
    nano = require('gulp-cssnano'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    eslint = require('gulp-eslint'),
    include = require("gulp-html-tag-include");

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
  gulp.start('include', 'styles', 'scripts');
});

// Запуск живой сборки
gulp.task('live', function() {
  gulp.start('server', 'include', 'styles', 'scripts', 'watch');
});

// Туннель
gulp.task('external-world', function() {
  gulp.start('web-server', 'include', 'styles', 'scripts', 'watch');
});

// Федеральная служба по контролю за оборотом файлов
gulp.task('watch', function() {
  gulp.watch(paths.styles + '**/*.css', ['styles']);
  gulp.watch(paths.scripts + '*.js', ['scripts']);
  gulp.watch(paths.templates + '**/*.html', ['include', 'html']);
  gulp.watch(paths.templates + 'blocks/*.html', ['include', 'html']);
});

// Шаблонизация
gulp.task('include', function() {
  return gulp.src(paths.templates + '*.html')
  .pipe(plumber({errorHandler: onError}))
  .pipe(include())
  .pipe(gulp.dest(paths.html));
});

// Компиляция стилей, добавление префиксов
gulp.task('styles', function () {
  var processors = [
    vars,
    nested
  ];
  return gulp.src(paths.styles + 'layout.css')
  .pipe(plumber({errorHandler: onError}))
  .pipe(cssnext())
  .pipe(postcss(processors))
  .pipe(rename('style.css'))
  .pipe(nano({convertValues: {length: false}}))
  .pipe(gulp.dest(paths.css))
  .pipe(reload({stream: true}));
});

// Сборка и минификация скриптов
gulp.task('scripts', function() {
  return gulp.src(paths.scripts + '*.js')
  .pipe(plumber({errorHandler: onError}))
  .pipe(eslint())
  .pipe(eslint.format())
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
var onError = function(error) {
  gutil.log([
    (error.name + ' in ' + error.plugin).bold.red,
    '',
    error.message,
    ''
  ].join('\n'));
  gutil.beep();
  this.emit('end');
};
