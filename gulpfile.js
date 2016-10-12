'use strict';

var gulp = require('gulp'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    portfinder = require('portfinder'),
    postcss = require('gulp-postcss'),
    nested = require("postcss-nested"),
    cssnext = require("postcss-cssnext"),
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
    del = require('del'),
    path = require('path'),
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
  gulp.start('pug', 'styles', 'scripts');
});

// Запуск живой сборки
gulp.task('live', function() {
  gulp.start('server', 'pug', 'styles', 'scripts', 'watch');
});

// Туннель
gulp.task('external-world', function() {
  gulp.start('web-server', 'pug', 'styles', 'scripts', 'watch');
});

// Федеральная служба по контролю за оборотом файлов
gulp.task('watch', function() {
  var watch = [
    {
      templates: {
        path: paths.templates,
        task: gulp.watch(paths.templates + '**/*.pug', ['pug', 'html'])
      }
    },
    {
      styles: {
        path: paths.styles,
        task: gulp.watch(paths.styles + '**/*.pcss', ['styles'])
      }
    },
    {
      scripts: {
        path: paths.scripts,
        task: gulp.watch(paths.scripts + '*.js', ['scripts'])
      }
    }
  ];

  for (var tasks = 0; tasks < watch.length; tasks++) {
    var currPath = watch[tasks][Object.keys(watch[tasks])[0]].path;
    (watch[tasks][Object.keys(watch[tasks])[0]].task).on('change', function(event) {
      if (event.type === 'deleted') {
        clearCache(event, currPath);
        if (currPath === paths.templates) {
          deleteTemplateFile(event);
        }
      }
    });
  }

  function deleteTemplateFile (e) {
    var folder = (e.path).split(path.sep);
    if (folder[folder.length - 2] === 'templates') {
      var filePathFromSrc = path.relative(path.resolve(paths.templates), e.path);
      var destFilePath = path.resolve('./', path.parse(filePathFromSrc).name) + '.html';
      del.sync(destFilePath);
    }
  }

  function clearCache (e, currPath) {
    delete cache.caches[currPath][e.path];
    remember.forget(currPath, e.path);
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
  var processors = [
    imprt(),
    cssnext(),
    vars(),
    nested(),
    inline()
  ];
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
