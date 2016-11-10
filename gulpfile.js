'use strict';

var gulp = require('gulp'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    portfinder = require('portfinder'),
    postcss = require('gulp-postcss'),
    nested = require('postcss-nested'),
    cssnext = require('postcss-cssnext'),
    vars = require('postcss-simple-vars'),
    imprt = require('postcss-import'),
    nano = require('gulp-cssnano'),
    browserSync = require("browser-sync"),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    pug = require('gulp-pug'),
    inline  = require('postcss-inline-svg'),
    cache = require('gulp-cached'),
    remember = require('gulp-remember'),
    image = require('gulp-imagemin'),
    cachebust = require('gulp-cache-bust'),
    reload = browserSync.reload;

var processors = [
  imprt(),
  cssnext(),
  vars(),
  nested(),
  inline()
];

// Ресурсы проекта
var paths = {
  styles: 'assets/source/styles/',
  css: 'assets/css/',
  scripts: 'assets/source/scripts/',
  js: 'assets/js/',
  templates: 'templates/',
  images: 'assets/source/img/',
  bundles: 'assets/img/',
  html: './'
};

// Одноразовая сборка проекта
gulp.task('default', function() {
  gulp.start('cache', 'images', 'styles', 'scripts');
});

// Запуск живой сборки
gulp.task('live', function() {
  gulp.start('server', 'cache', 'images', 'styles', 'scripts', 'watch');
});

// Туннель
gulp.task('external-world', function() {
  gulp.start('web-server', 'cache', 'images', 'styles', 'scripts', 'watch');
});

// Федеральная служба по контролю за оборотом файлов
gulp.task('watch', function() {
  var templates = gulp.watch(paths.templates + '**/*.pug', ['cache']);
  var styles = gulp.watch(paths.styles + '**/*.pcss', ['styles']);
  var scripts = gulp.watch(paths.scripts + '*.js', ['scripts']);
  var images = gulp.watch(paths.images + '**/*.{png,jpg,gif,svg}', ['images']);

  templates.on('change', function(event) {
    if (event.type === 'deleted') {
      clearCache(event, paths.templates);
    }
  });

  scripts.on('change', function(event) {
    if (event.type === 'deleted') {
      clearCache(event, paths.scripts);
    }
  });

  images.on('change', function(event) {
    if (event.type === 'deleted') {
      clearCache(event, paths.images);
    }
  });

  function clearCache (e, path) {
    delete cache.caches[path][e.path];
    remember.forget(path, e.path);
  }
});

// Шаблонизация
gulp.task('pug', function() {
  return gulp.src(paths.templates + '*.pug')
    .pipe(cache(paths.templates))
    .pipe(remember(paths.templates))
    .pipe(plumber({errorHandler: onError}))
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest(paths.html));
});

// Компиляция стилей, добавление префиксов
gulp.task('styles', function () {
  return gulp.src(paths.styles + 'layout.pcss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(postcss(processors))
    .pipe(rename('style.css'))
    .pipe(nano({convertValues: {length: false}}))
    .pipe(gulp.dest(paths.css))
    .pipe(reload({stream: true}));
});

// Сборка и минификация скриптов
gulp.task('scripts', function() {
  return gulp.src(paths.scripts + '*.js')
    .pipe(cache(paths.scripts))
    .pipe(remember(paths.scripts))
    .pipe(plumber({errorHandler: onError}))
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js))
    .pipe(reload({stream: true}));
});

// Сжимает как шакал! 10 шакалов из 10!
gulp.task('images', function() {
  gulp.src(paths.images + '/**/*.{png,jpg,gif,svg}')
    .pipe(cache(paths.images))
    .pipe(remember(paths.images))
    .pipe(image({
      verbose: true
    }))
    .pipe(gulp.dest(paths.bundles));
});

// Очистка кэша для CSS и JS файлов
gulp.task('cache', ['pug', 'html'], function() {
  gulp.src(paths.html + '*.html')
    .pipe(cachebust({
      type: 'timestamp'
    }))
    .pipe(gulp.dest(paths.html));
});

// Запуск локального сервера
gulp.task('server', function() {
  portfinder.getPort(function (err, port) {
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
  portfinder.getPort(function (err, port) {
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
