const gulp        = require('gulp');
const cssfont64   = require('gulp-cssfont64');
const clean       = require('gulp-clean');
const concat      = require('gulp-concat');
const browserSync = require("browser-sync");
const reload      = browserSync.reload;
const paths       = require('./paths');

// Конвертация шрифтов в CSS
function inlineFonts() {
  return gulp
    .src(paths.fonts_src + '*')
    .pipe(cssfont64())
    .pipe(gulp.dest(paths.fonts_src));
}

// Объединение основных стилей со шрифтовым CSS
function concatFonts() {
  return gulp
    .src([paths.fonts_src + '*.css', paths.css + 'style.css'])
    .pipe(concat('style.css'))
    .pipe(gulp.dest(paths.css))
    .pipe(reload({stream: true}));
}

// Удаление шрифтового CSS
function clearFonts() {
  return gulp
    .src(paths.fonts_src + '*.css', {read: false})
    .pipe(clean());
}

gulp.task(inlineFonts);
gulp.task(concatFonts);
gulp.task(clearFonts);

gulp.task('fonts', gulp.series('inlineFonts', 'concatFonts', 'clearFonts'));
