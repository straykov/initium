'use strict';

import path from 'path';
import del from 'del';

import gulp from 'gulp';
import rename from 'gulp-rename';
import gutil from 'gulp-util';
import plumber from 'gulp-plumber';
import portfinder from 'portfinder';
import nano from 'gulp-cssnano';
import pug from 'gulp-pug';
import cache from 'gulp-cached';
import image from 'gulp-imagemin';
import cachebust from 'gulp-cache-bust';
import errorHandler from 'gulp-plumber-error-handler';
import browserSync from 'browser-sync';

import postcss from 'gulp-postcss';
import precss from 'precss';
import cssnext from 'postcss-cssnext';
import inline  from 'postcss-inline-svg';

import webpack from 'webpack';
import makeWebpackConfig from './webpack.config.js';
import statsLogger from 'webpack-stats-logger';
import debuga from 'debuga';


var processors = [
  precss(),
  cssnext(),
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
  gulp.start('pug', 'styles', 'scripts', 'cache', 'img');
});

// Запуск живой сборки
gulp.task('live', function() {
  gulp.start('pug', 'styles', 'webpack:watch', 'img', 'cache', 'watch', 'server');
});

// Запуск туннеля в интернет
gulp.task('external-world', function() {
  gulp.start('pug', 'styles', 'webpack:watch', 'img', 'cache', 'watch', 'web-server');
});

// Cборка с вотчем без браузерсинка
gulp.task('no-server', function() {
  gulp.start('pug', 'styles', 'scripts', 'img', 'cache', 'watch');
});

// Федеральная служба по контролю за оборотом файлов
gulp.task('watch', function() {
  gulp.watch(paths.templates + '**/*.pug', ['pug']);
  gulp.watch(paths.styles + '**/*.pcss', ['styles', 'cache']);
  gulp.watch(paths.html + '*.html', ['html', 'cache']);
  gulp.watch(paths.img + '*.{png,jpg,gif,svg}', ['img']).on('change', function(event) {
    if (event.type === 'deleted') {
      del(paths.bundles + path.basename(event.path));
      delete cache.caches['img'][event.path];
    }
  });
});

// Шаблонизация
gulp.task('pug', function() {
  gulp.src(paths.templates + '*.pug')
    .pipe(plumber({errorHandler: onError}))
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest(paths.html));
});

// Компиляция стилей, добавление префиксов
gulp.task('styles', function () {
  gulp.src(paths.styles + 'layout.pcss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(postcss(processors))
    .pipe(rename('style.css'))
    .pipe(nano({convertValues: {length: false}}))
    .pipe(gulp.dest(paths.css));
});

// Lint for god sick 
gulp.task('styles:lint', function () {
  gulp.src(paths.styles + '**.pcss')
    .pipe(postcss([
      require('stylelint')(),
      require('postcss-reporter')({clearMessages: true})]
    ));
});


const {NODE_ENV, NOTIFY} = process.env;
const isDebug = NODE_ENV !== 'production';
const scriptsErrorHandler = errorHandler('Error in \'scripts\' task');

function runWebpack(watch = false) {
  return function (callback) {
    const webpackConfig = makeWebpackConfig({
      watch,
      debug: isDebug,
      sourcemaps: isDebug,
      notify: NOTIFY
    });
    
    return webpack(webpackConfig, (error, stats) => {
      const jsonStats = stats.toJson();
      if (jsonStats.errors.length) {
        jsonStats.errors.forEach(message => {
          scriptsErrorHandler.call({emit() {/* noop */}}, {message});
        });
      }
      statsLogger(error, stats);
      
      // original issue: https://github.com/CSSSR/csssr-project-template/issues/169
      if (watch === false) {
        callback();
      }
    });
  };
}

gulp.task('webpack', runWebpack(false));

gulp.task('webpack:watch', runWebpack(true));


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
gulp.task('cache', function cacheTask() {
  gulp.src(paths.html + '*.html')
    .pipe(cachebust())
    .pipe(gulp.dest(paths.html))
    .pipe(browserSync.reload({stream: true}));
});

var bsConfig = {
  files: ['*'],
  reloadOnRestart: true,
  port: null,
  tunnel: null,
  snippetOptions: {
    rule: {
      match: /<\/body>/i
    }
  },
  server: {
    baseDir: '.',
    directory: false,
    middleware: NODE_ENV !== 'production' ? [debuga({ dist: '.' })] : []
  }
};

// Локальный сервер
gulp.task('server', () => (
  portfinder.getPort(function (err, port) {
    if (err) throw err;
    
    bsConfig.port = port;
  
    browserSync(bsConfig);
  })
));


// Локальный сервер c туннелем в интернет
gulp.task('web-server', () => (
  portfinder.getPort(function (err, port) {
    if (err) throw err;
  
    bsConfig.port = port;
    bsConfig.tunnel = true;
  
    browserSync(bsConfig);
  })
));

// Рефреш ХТМЛ-страниц
gulp.task('html', function () {
  gulp.src(paths.html + '*.html')
    .pipe(browserSync.reload({stream: true}));
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
