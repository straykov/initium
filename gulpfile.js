'use strict';


const gulp = require('gulp'),
  path = require('path'),
  fs = require('fs'),
  del = require('del'),
  rename = require('gulp-rename'),
  gutil = require('gulp-util'),
  plumber = require('gulp-plumber'),
  portfinder = require('portfinder'),
  postcss = require('gulp-postcss'),
  precss = require('precss'),
  cssnext = require('postcss-cssnext'),
  nano = require('gulp-cssnano'),
  browserSync = require("browser-sync"),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  twig = require('gulp-twig'),
  data = require('gulp-data'),
  inline = require('postcss-inline-svg'),
  cache = require('gulp-cached'),
  image = require('gulp-imagemin'),
  cachebust = require('gulp-cache-bust'),
  eslint = require('gulp-eslint'),
  babel = require("gulp-babel"),
  reload = browserSync.reload;

const processors = [
  precss(),
  cssnext(),
  inline()
];

// Ресурсы проекта
const paths = {
  styles: 'assets/source/styles/',
  css: 'assets/css/',
  scripts: 'assets/source/scripts/',
  js: 'assets/js/',
  templates: 'templates/',
  img: 'assets/source/img/',
  bundles: 'assets/img/',
  html: './',
  fonts_src: 'assets/source/fonts/',
  fonts_dest: 'assets/fonts/',
  json: 'templates/data.json',
};

// Одноразовая сборка проекта
gulp.task('default', function() {
  gulp.start('twig', 'styles', 'scripts', 'cache', 'img', 'fonts');
});

// Запуск живой сборки
gulp.task('live', function() {
  gulp.start('twig', 'styles', 'scripts', 'img', 'fonts', 'cache', 'watch', 'server');
});

// Запуск туннеля в интернет
gulp.task('external-world', function() {
  gulp.start('twig', 'styles', 'scripts', 'img', 'fonts', 'cache', 'watch', 'web-server');
});

// Cборка с вотчем без браузерсинка
gulp.task('no-server', function() {
  gulp.start('twig', 'styles', 'scripts', 'img', 'fonts', 'cache', 'watch');
});

// Федеральная служба по контролю за оборотом файлов
gulp.task('watch', function() {
  gulp.watch(paths.templates + '**/*.twig', ['twig']);
  gulp.watch(paths.json, ['twig']);
  gulp.watch(paths.styles + '**/*.pcss', ['styles', 'cache']);
  gulp.watch(paths.scripts + '*.js', ['scripts', 'cache']);
  gulp.watch(paths.img + '*.{png,jpg,gif,svg}', ['img']).on('change', function(event) {
    if (event.type === 'deleted') {
      del(paths.bundles + path.basename(event.path));
      delete cache.caches['img'][event.path];
    }
  });
});

// Шаблонизация
gulp.task('twig', function() {
  gulp.src(paths.templates + '*.twig')
    .pipe(plumber({errorHandler: onError}))
    .pipe(data(function(file) {
      if (fs.existsSync(paths.json)) {
        return JSON.parse(fs.readFileSync(paths.json));
      }
    }))
    .pipe(twig())
    .pipe(gulp.dest(paths.html))
    .pipe(reload({stream: true}));
});

// Компиляция стилей, добавление префиксов
gulp.task('styles', function() {
  gulp.src(paths.styles + 'layout.pcss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(postcss(processors))
    .pipe(rename('style.css'))
    .pipe(nano({convertValues: {length: false}}))
    .pipe(gulp.dest(paths.css));
});

// Lint for god sick
gulp.task('styles:lint', function() {
  gulp.src(paths.styles + '**.pcss')
    .pipe(postcss([
      require('stylelint')(),
      require('postcss-reporter')({clearMessages: true})]
    ));
});

// Сборка и минификация скриптов
gulp.task('scripts', function() {
  gulp.src(paths.scripts + '*.js')
    .pipe(plumber({errorHandler: onError}))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel())
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js));
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

// Копирование шрифтов
gulp.task('fonts', function() {
  gulp.src(paths.fonts_src + '*.{woff,woff2}')
    .pipe(gulp.dest(paths.fonts_dest));
});

// Очистка кэша для яваскрипта и ЦССа
gulp.task('cache', function() {
  gulp.src(paths.html + '*.html')
    .pipe(cachebust())
    .pipe(gulp.dest(paths.html))
    .pipe(reload({stream: true}));
});

// Локальный сервер
gulp.task('server', function() {
  portfinder.getPort(function(err, port) {
    browserSync({
      server: {
        baseDir: ".",
        serveStaticOptions: {
          extensions: ['html']
        }
      },
      host: 'localhost',
      notify: false,
      port: port
    });
  });
});

// Локальный сервер c туннелем в интернет
gulp.task('web-server', function() {
  portfinder.getPort(function(err, port) {
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
gulp.task('html', function() {
  gulp.src(paths.html + '*.html')
    .pipe(reload({stream: true}));
});

// Ошибки
const onError = function(error) {
  gutil.log([
    (error.name + ' in ' + error.plugin).bold.red,
    '',
    error.message,
    ''
  ].join('\n'));
  gutil.beep();
  this.emit('end');
};