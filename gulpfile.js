'use strict';

const gulp = require('gulp'),
      path = require('path'),
      fs = require('fs'),
      del = require('del'),
      rename = require('gulp-rename'),
      log = require('fancy-log'),
      beeper = require('beeper'),
      plumber = require('gulp-plumber'),
      portfinder = require('portfinder'),
      postcss = require('gulp-postcss'),
      sass = require('gulp-sass'),
      browserSync = require("browser-sync"),
      uglify = require('gulp-uglify'),
      concat = require('gulp-concat'),
      twig = require('gulp-twig'),
      data = require('gulp-data'),
      cache = require('gulp-cached'),
      image = require('gulp-imagemin'),
      cachebust = require('gulp-cache-bust'),
      eslint = require('gulp-eslint'),
      babel = require("gulp-babel"),
      duration = require('gulp-duration'),
      sasslint = require('gulp-sass-lint'),
      cssfont64 = require('gulp-cssfont64'),
      runSequence = require('run-sequence'),
      clean = require('gulp-clean'),
      reload = browserSync.reload;

const processors = [
  require('postcss-inline-svg'),
  require('autoprefixer'),
  require('css-mqpacker'),
];

// Ресурсы
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
};

// Одноразовая сборка
gulp.task('default', function() {
  gulp.start('twig', 'styles', 'scripts', 'img', 'cache');
});

// Запуск живой сборки
gulp.task('live', function() {
  gulp.start('twig', 'styles', 'scripts', 'img', 'cache', 'watch', 'server');
});

// Cборка с вотчем без браузерсинка
gulp.task('no-server', function() {
  gulp.start('twig', 'styles', 'scripts', 'img', 'cache', 'watch');
});

// Федеральная служба по контролю за оборотом файлов
gulp.task('watch', function() {
  gulp.watch(paths.templates + '**/*.twig', ['twig']);
  gulp.watch(paths.styles + '**/*.scss', ['styles', 'cache']);
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
    .pipe(twig())
    .pipe(gulp.dest(paths.html))
    .pipe(reload({stream: true}));
});

// Стили
gulp.task('styles', function() {
  runSequence('scss', 'inline-fonts', 'concat-fonts', 'clear-fonts')
});

// Сборка SCSS
gulp.task('scss', function() {
  return gulp.src(paths.styles + 'style.scss')
    .pipe(sass({
      outputStyle: 'compressed',
      errLogToConsole: true,
      precision: 8
    }).on('error', onError))
    .pipe(postcss(processors))
    .pipe(duration(`style.css has built`))
    .pipe(gulp.dest(paths.css));
});

// Конвертация шрифтов в CSS
gulp.task('inline-fonts', function() {
  return gulp.src(paths.fonts_src + '*')
    .pipe(cssfont64())
    .pipe(gulp.dest(paths.fonts_src));
});

// Объединение основных стилей со шрифтовым CSS
gulp.task('concat-fonts', function() {
  return gulp.src([paths.fonts_src + '*.css', paths.css + 'style.css'])
    .pipe(concat('style.css'))
    .pipe(gulp.dest(paths.css))
    .pipe(reload({stream: true}));
});

// Удаление шрифтового CSS
gulp.task('clear-fonts', function() {
  return gulp.src(paths.fonts_src + '*.css', {read: false})
    .pipe(clean());
});

// Сборка и минификация скриптов
gulp.task('scripts', function() {
  gulp.src(paths.scripts + '*.js')
    .pipe(plumber({errorHandler: onError}))
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

// Очистка кэша для скриптов и стилей
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

// Рефреш страниц
gulp.task('html', function() {
  gulp.src(paths.html + '*.html')
    .pipe(reload({stream: true}));
});

// Ошибки
const onError = function(error) {
  log([
    (error.name + ' in ' + error.plugin).bold.red,
    '',
    error.message,
    ''
  ].join('\n'));
  beeper();
  this.emit('end');
};
