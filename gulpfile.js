'use strict';

var gulp = require('gulp'),
    path = require('path'),
    del = require('del'),
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
    image = require('gulp-imagemin'),
    debug = require('gulp-debug'),
    cachebust = require('gulp-cache-bust'),
    eslint = require('gulp-eslint'),
    babel = require("gulp-babel"),
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
  img: 'assets/source/img/',
  bundles: 'assets/img/',
  html: './'
};

// Одноразовая сборка проекта
gulp.task('default', function() {
  gulp.start('cache', 'img', 'styles', 'scripts');
});

// Запуск живой сборки
gulp.task('live', function() {
  gulp.start('cache', 'img', 'styles', 'scripts', 'watch', 'server');
});

// Туннель
gulp.task('external-world', function() {
  gulp.start('cache', 'img', 'styles', 'scripts', 'watch', 'web-server');
});

// Федеральная служба по контролю за оборотом файлов
gulp.task('watch', function() {
  gulp.watch(paths.templates + '**/*.pug', ['cache']);
  gulp.watch(paths.styles + '**/*.pcss', ['styles']);
  gulp.watch(paths.scripts + '*.js', ['scripts']);
  gulp.watch(paths.img + '*.{png,jpg,gif,svg}', ['img']).on('change', function(event) {
    if (event.type === 'deleted') {
      del(paths.bundles + path.basename(event.path));
      delete cache.caches['img'][event.path];
    }
  });
});

// Шаблонизация
gulp.task('pug', function() {
  return gulp.src(paths.templates + '*.pug')
    .pipe(plumber({errorHandler: onError}))
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest(paths.html))
    .pipe(reload({stream: true}));
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
    .pipe(plumber({errorHandler: onError}))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel())
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js))
    .pipe(reload({stream: true}));
});

// Сжатие картинок
gulp.task('img', function() {
  gulp.src(paths.img + '/**/*.{png,jpg,gif,svg}')
    .pipe(cache('img'))
    .pipe(image({
      verbose: true
    }))
    .pipe(gulp.dest(paths.bundles));
});

// Очистка кэша для яваскрипта и ЦССа
gulp.task('cache', ['pug'], function() {
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
